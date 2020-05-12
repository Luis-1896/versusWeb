import loginRoutes from './login';

export default [
    {
        path: '*',
        redirect: '/login'
    },
    loginRoutes
]