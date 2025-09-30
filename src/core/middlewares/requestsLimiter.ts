// import rateLimit from 'express-rate-limit';
//
// export const requestsLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   limit: 5, // максимум 5 регистраций в минуту с одного IP
//   message: {
//     errorsMessages: [
//       {
//         message: 'Too many requests, please try again later.',
//         field: 'global',
//       },
//     ],
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
//
// export const registrationLimiter = rateLimit({ windowMs: 10 * 1000, limit: 5 });
// export const confirmationLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   limit: 10,
// });
// export const resendLimiter = rateLimit({ windowMs: 60 * 1000, limit: 3 });
