<template>
    <v-container>
        <v-row justify="center">
            <v-col xs="12" sm="12" md="10" lg="8" xl="5">
                <transition name="nested-section-view">
                    <div v-if="activeMainView">
                        <div class="d-flex flex-row-reverse mb-5">
                          <v-tooltip bottom transition="fab-transition">
                               <template v-slot:activator="{on}">
                                   <v-btn color="success" v-on="on" fab dark :to="{name:'home.players.create'}">
                                       <v-icon>add</v-icon>
                                   </v-btn>
                               </template>
                               <span>Agregar Jugador</span>
                           </v-tooltip>
                        </div>
                    </div>
                </transition>
                <transition name="nested-section-view">
                    <router-view name="playersOptionsView"></router-view>
                </transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        name:"Players",
        data() {
            return{
                activeMainView: true
            }

        },
        watch: {
            '$route'() {
                this.updateMainView();
            }
        },
        mounted() {
            this.updateMainView();
        },
        methods:{
            updateMainView() {
                let currentRoute = this.$router.currentRoute.name.split('.').pop();
                //console.log(currentRoute);
                this.activeMainView = (currentRoute === 'players');
            }
        }

    }
</script>

<style scoped>

</style>