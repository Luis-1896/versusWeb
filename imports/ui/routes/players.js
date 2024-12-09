import Players from '../views/Admin/Players/Players';
import PlayersCreateEdit from '../views/Admin/Players/PlayersCreateEdit'

export default {
    name: 'home.players',
    path: 'jugadores',
    meta: {
        breadcrumb: 'Jugadores',
        permission: 'player-view',
    },
    components:{
        sectionView: Players
    },
    children: [
        {
            name: 'home.players.create',
            path: 'crear',
            meta: {
                breadcrumb: 'Crear jugador',
                permission: 'player-create'
            },
            components: {
               playersOptionsView: PlayersCreateEdit
            }
        }
    ]
}