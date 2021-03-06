import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import PatientService from '../../services/patient-service';
import { Container } from 'typedi';
import middleware from '../middleware';
import { IPatientData, IReportPatient } from '../../interfaces/IPatient';
import { getUserAuth } from '../middleware/userAuthData';
import { ISymptom } from '../../interfaces/ISymptom';

const route = Router();

const PATIENT_SCHEMA_MAP = {
	medicalId: Joi.string().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	testResult: Joi.string().required(),
	address: Joi.string().required(),
	email: Joi.string().required(),
	phoneNumber: Joi.string().required(),
	gender: Joi.string().required(),
	dob: Joi.string().required()
};

export default (app: Router) => {

	app.use('/patients', route);

	route.post('/create', middleware.authenticateJWT,
		celebrate({
			body: Joi.object(PATIENT_SCHEMA_MAP)
		}), async (req, res, next) => {
			console.debug('Calling create patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.createUser(userId, req.body as IPatientData).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/all', middleware.authenticateJWT,
		async (req, res, next) => {
			console.debug('Calling get all patients..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.getAllPatients(userId).then((patient) => {
				return res.json(patient);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/:medicalId', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.getPatientWithId(userId, req.params.medicalId).then((patient) => {
				return res.json(patient);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/:medicalId/doctor', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get doctor for patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.getPatientDoctor(userId, req.params.medicalId).then((patient) => {
				return res.json(patient);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.patch('/:medicalId/status', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				status: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling update status..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.updateTestResult(userId, req.params.medicalId, req.body.status).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:medicalId/flag', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling flag patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.flagPatient(userId, req.params.medicalId, req.body.role).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:medicalId/unflag', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling unflag patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.unFlagPatient(userId, req.params.medicalId, req.body.role).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:medicalId/report', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				people: Joi.array()
			})
		}), async (req, res, next) => {
			console.debug('Calling report in contact with..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.reportInContactWith(userId, req.params.medicalId, req.body.people as IReportPatient[]).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/:medicalId/symptoms', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get requested symptoms..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.getMyRequestedSymptoms(userId, req.params.medicalId).then((symptoms) => {
				return res.json(symptoms);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:medicalId/symptoms/response', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				responseList: Joi.array()
			})
		}), async (req, res, next) => {
			console.debug('Calling submit symptoms response..');
			try {
				const userId = getUserAuth(req.headers).user_id;
				const patientServiceInstance = Container.get(PatientService);
				await patientServiceInstance.submitSymptomsResponse(userId, req.params.medicalId,
					req.body.responseList as ISymptom[]);
				return res.status(200).end();
			} catch (error) {
				return next(error);
			}
		}
	);

	route.post('/:medicalId/remind', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling remind patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.remindPatient(userId, req.params.medicalId).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:medicalId/unremind', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling unremind patient..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.unRemindPatient(userId, req.params.medicalId).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/:medicalId/latest-symptoms', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get latest symptoms..');
			const userId = getUserAuth(req.headers).user_id;
			const patientServiceInstance = Container.get(PatientService);
			patientServiceInstance.getLatestSymptoms(userId, req.params.medicalId).then((symptoms) => {
				return res.json(symptoms);
			}).catch((error) => {
				return next(error);
			});
		}
	);

};
