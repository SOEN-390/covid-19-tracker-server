VERSION=""

# get parameters
while getopts v: flag
do
  case "${flag}" in
    v) CURRENT_VERSION=${OPTARG};;
  esac
done

if [[ $CURRENT_VERSION == '' ]]
then
  CURRENT_VERSION='0.1.0'
fi
echo "Current Package.json Version: $CURRENT_VERSION"

# get highest tag number in github
git fetch --prune --unshallow 2>/dev/null
GITHUB_VERSION=`git describe --abbrev=0 --tags 2>/dev/null`
GITHUB_VERSION="${GITHUB_VERSION:1}"

echo "Current GitHub Version: $GITHUB_VERSION"

# replace . with space so can split into an array
CURRENT_VERSION_PARTS=(${CURRENT_VERSION//./ })
GITHUB_VERSION_PARTS=(${GITHUB_VERSION//./ })

# get number parts
VNUM1=${CURRENT_VERSION_PARTS[0]}
VNUM2=${CURRENT_VERSION_PARTS[1]}

GVNUM1=${GITHUB_VERSION_PARTS[0]}
GVNUM2=${GITHUB_VERSION_PARTS[1]}
GVNUM3=${GITHUB_VERSION_PARTS[2]}
echo "Current GitHub Version1: $GVNUM1"

if [[ $VNUM1 == $GVNUM1 && $VNUM2 == $GVNUM2 ]]
then
  # increase patch
  GVNUM3=$((GVNUM3+1))
else
  GVNUM3=0
fi

# create new tag
NEW_TAG="v$VNUM1.$VNUM2.$GVNUM3"
echo "($VERSION) updating $GITHUB_VERSION to $NEW_TAG"

if [[ $NEW_TAG < $GITHUB_VERSION ]]
then
  echo "Package.json does not have the latest tag version"
  exit 1
fi

# get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT 2>/dev/null`

# only tag if no tag already
if [ -z "$NEEDS_TAG" ]
then
  echo "Tagged with $NEW_TAG"
  git tag $NEW_TAG
  git push --tags
  git push
else
  echo "Already a tag on this commit"
fi

echo ::set-output name=git-tag::$NEW_TAG

exit 0
