import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import DoctorService from '../../services/doctor-service';
import { Container } from 'typedi';
import middleware from '../middleware';
import { getUserAuth } from '../middleware/userAuthData';
import PatientService from '../../services/patient-service';
import { IAppointment } from '../../interfaces/IAppointment';

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
		console.debug('Calling get all doctors..');
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

	route.post('/:licenseId/patient/:medicalId/symptoms', middleware.authenticateJWT,
		celebrate(
			{
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
				return res.status(200).end();
			} catch (e) {
				return next(e);
			}
		});

	route.get('/:licenseId/patient/:medicalId/symptoms/history', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required(),
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get symptoms response of patient..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getPatientSymptomsHistory(userId, req.params.licenseId as string,
			req.params.medicalId as string).then((symptomsResponse) => {
				return res.json(symptomsResponse);
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.get('/patient/:medicalId/contacts', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling get patients contacts..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getPatientContacts(userId, req.params.medicalId).then((contacts) => {
				return res.json(contacts);
			}).catch((error) => {
				return next(error);
			});
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

	route.patch('/:medicalId/review', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling reviewed patient..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.reviewPatient(userId, req.params.medicalId).then((patient) => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.patch('/:medicalId/unreview', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required()
			}),
			body: Joi.object({
				role: Joi.string().required()
			})
		}), async (req, res, next) => {
			console.debug('Calling unreviewed patient..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.unReviewPatient(userId, req.params.medicalId).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.patch('/:licenseId/emergency-leave', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required()
			})
		}),
		async (req, res, next) => {
			console.debug('Calling declare emergency leave for doctor..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.declareEmergencyLeave(userId, req.params.licenseId).then(() => {
				return res.status(200).end();
			}).catch((error) => {
				return next(error);
			});
		}
	);

	route.post('/:licenseId/patients/:medicalId/appointment', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				medicalId: Joi.string().required(),
				licenseId: Joi.string().required()
			}),
			body: Joi.object({
				appointment: Joi.object({
					date: Joi.string().required(),
					subject: Joi.string().required()
				})
			})
		}), async (req, res, next) => {
			console.debug('Calling book appointment..');
			try {
				const userId = getUserAuth(req.headers).user_id;
				const doctorServiceInstance = Container.get(DoctorService);
				await doctorServiceInstance.bookAppointment(userId, req.params.licenseId,
					req.params.medicalId, req.body.appointment as IAppointment);
				return res.status(200).end();
			}
			catch (error) {
				return next(error);
			}
		}
	);

	route.get('/:licenseId/upcoming-appointments', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required()
			})
		}),
		async (req, res, next) => {
			console.debug('Calling get upcoming appointments for doctor..');
			const userId = getUserAuth(req.headers).user_id;
			const doctorServiceInstance = Container.get(DoctorService);
			doctorServiceInstance.getUpcomingAppointments(userId, req.params.licenseId).then((appointments) => {
				return res.json(appointments);
			}).catch((error) => {
				return next(error);
			});
		}
	);

};



