<template>
    <v-app>
        <transition :name="$router.currentRoute.name">
            <router-view name="allPageView"></router-view>
        </transition>
        <alert-message/>
        <loader/>
    </v-app>
</template>

<script>
    import AlertMessage from './components/Utilities/Alerts/AlertMessage';
    import Loader from './components/Utilities/Loaders/Loader';

    export default {
        name: 'App',
        components: { AlertMessage, Loader },
    };
</script>

<style>
    /* Cerrar sesión SPA */
    .login-leave-active {
        transition: all .5s linear;
    }

    .login-leave-to {
        transform: scale(0);
        opacity: 0;
    }

    /*Cerrar sesión LOGIN*/
    .login-enter-active {
        transition: all .5s linear .4s;
    }

    .login-enter {
        transform: scale(2);
        opacity: 0;
    }

    /*Transición al iniciar sesión */
    .home-leave-active {
        transition: all .5s;
    }

    .home-leave-to {
        transform: scale(0);
    }
</style>