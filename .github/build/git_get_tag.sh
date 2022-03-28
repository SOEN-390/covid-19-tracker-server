# get highest tag number in github
git fetch --prune --unshallow 2>/dev/null
GITHUB_VERSION=`git describe --abbrev=0 --tags 2>/dev/null`
GITHUB_VERSION="v${GITHUB_VERSION:1}"

echo "Current GitHub Version: $GITHUB_VERSION"

echo ::set-output name=git-tag::$GITHUB_VERSION

exit 0
