<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="headline">Configurar cuenta</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xs="12" sm="6" md="6" v-if="noPlayer">
                <GeneralData/>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="6" v-else>
                <GeneralDataPlayer/>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="6">
                <update-password/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import UpdatePassword from "../../components/ConfigureAccount/UpdatePassword";
    import GeneralData from "../../components/ConfigureAccount/GeneralData";
    import GeneralDataPlayer from "../../components/ConfigureAccount/GeneralDataPlayer";
    import validateMixin from "../../mixins/validation";
    import profilesMixin from '../../mixins/accounts/profiles';
    import { mapMutations } from 'vuex';

    export default {
        name: "ConfigureAccount",
        mixins:[validateMixin, profilesMixin],
        components: {GeneralData, UpdatePassword, GeneralDataPlayer},
        data(){
            return{
              perfil: null,
              noPlayer: null
            };
        },
        created() {
            const usuario=this.$store.state.auth.user;
            this.perfil=usuario.profile.perfil;
            this.perfil!=='player' ? this.noPlayer=true : this.noPlayer=false;
        },
        methods:{
            ...mapMutations('auth', ['setUser'])
        }
    }
</script>

<style scoped>
</style>
