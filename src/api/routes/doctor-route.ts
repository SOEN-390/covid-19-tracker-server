import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import DoctorService from '../../services/doctor-service';
import { Container } from 'typedi';
import middleware from '../middleware';
import { IDoctorData } from '../../interfaces/IDoctor';
import { getUserAuth } from '../middleware/userAuthData';
import PatientService from '../../services/patient-service';
import { ISymptom } from '../../interfaces/ISymptom';

const route = Router();

const Doctor_SCHEMA_MAP = {
	licenseId: Joi.string().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	address: Joi.string().required(),
	email: Joi.string().required(),
	phoneNumber: Joi.string().required()
};

export default (app: Router) => {

	app.use('/doctors', route);

	route.get('/all', middleware.authenticateJWT, async (req, res, next) => {
		console.debug('Calling get all..');
		const userId = getUserAuth(req.headers).user_id;
		const doctorServiceInstance = Container.get(DoctorService);
		doctorServiceInstance.getAllDoctors(userId).then((doctor) => {
			return res.json(doctor);
		}).catch((error) => {
			return next(error);
		});
	});

	route.get('/:licenseId/patients/assigned', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required()
			})
		}),
		async (req, res, next) => {
			console.debug('Calling get assigned patients for doctor..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getAssignedPatients(userId, req.params.licenseId).then((patients) => {
				return res.json(patients);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/symptoms', middleware.authenticateJWT,
		async (req, res, next) => {
			console.debug('Calling get symptoms..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getSymptoms(userId).then((symptoms) => {
				return res.json(symptoms);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:licenseId/patient/:medicalId/symptoms', middleware.authenticateJWT, celebrate({
			params: Joi.object({
				medicalId: Joi.string().required(),
				licenseId: Joi.string().required()
			}),
			body: Joi.object({
				checklist: Joi.array()
			})
		}),
		async (req, res, next) => {
			console.debug('Calling request symptoms from patient..');
			try {
				const userId = getUserAuth(req.headers).user_id;
				const doctorServiceInstance = Container.get(DoctorService);
				await doctorServiceInstance.requestSymptomsFromPatient(userId, req.params.medicalId, req.params.licenseId,
					req.body.checklist as string[]);
			}
			catch (e) {
				return next(e);
			}
		}
	);

	route.get('/patient/:medicalId', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get patient as Doctor..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getPatientWithId(userId, req.params.medicalId).then((patient) => {
				return res.json(patient);
			}).catch((error) => {
				return next(error);
			});
		}
	);

};



