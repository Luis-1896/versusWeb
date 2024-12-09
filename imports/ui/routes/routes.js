import loginRoutes from './login';
import userRoutes from './users';
import profileRoutes from './profiles';
import playerRoutes from './players';
import LytSPA from "../layouts/LytSPA";
import ConfigureAccount from "../views/Account/ConfigureAccount";
import Home from "../views/Home/Home";
import FriendRequest from "../views/Admin/Friends/FriendRequest";

export default [
    {
        path: '*',
        redirect: '/login'
    },
    loginRoutes,
    {
        path: '/',
        components: {
            allPageView: LytSPA
        },
        meta: {
            requiresAuth: true,
            breadcrumb: "Inicio"
        },
        children: [
            {
                path: "",
                name: "home",
                meta: {
                    breadcrumb: "Inicio"
                },
                components: {
                    sectionView: Home
                }
            },
            {
                path: 'cuenta',
                name: 'home.account',
                meta: {
                    breadcrumb: "Configurar cuenta"
                },
                components: {
                    sectionView: ConfigureAccount
                }
            },
            {
                path: 'friend',
                name: 'home.friends',
                meta: {
                    breadcrumb: "Amigos"
                },
                components: {
                    sectionView: FriendRequest
                }
            },
            userRoutes,
            profileRoutes,
            playerRoutes
        ]
    }
]