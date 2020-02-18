/* guilds */
Vue.component('guilds', {
    props: ['guild'],
    computed: {
        avatarImg() {
            return `background-image: url(${this.guild.ownerAvatarURL})`;
        },
        iconImg() {
            return `background-image: url(${this.guild.icon})`;
        }
    },
        template: `<div class="guild-item"><div class="guild-icon" v-bind:style="iconImg"></div><div class="guild-info"><span class="guild-name">{{guild.name}}</span><div class="guild-owner"><div class="owner-avatar" v-bind:style="avatarImg"></div><span class="owner-name">{{guild.owner}}</span></div></div></div>`
});

let guildsCom = new Vue({
    el: '.guildsTab',
    data: {
        guilds: []
    }
});

let sectionName = new Vue({
    el: '.section-name',
    data: {
        sectionName: 'Your Bot'
    }
})

let getGuildInfo = () => {
    guildsCom.guilds = [];
    fetch('http://localhost:3000/api/guilds').then(response => {
        if (response.status != 200) {
            console.log(`Unable to fetch guilds! Status: ${response.status}`);
            return;
        }
        response.json().then(data => {
            data.forEach((f, i) => {
                fetch(`http://localhost:3000/api/guilds/${f}`).then(resp => {
                    if (resp.status != 200) {
                        console.log(`Unable to fetch guild data! Status: ${resp.status}`);
                        return;
                    }
                    resp.json().then(guildData => {
                        fetch(`http://localhost:3000/api/guilds/${f}/member/${guildData.ownerID}`).then(userResp => {
                            if (userResp.status != 200) {
                                console.log(`Unable to fetch guild owner data! Status: ${userResp.status}`);
                                return;
                            }
                            userResp.json().then(memberData => {
                                guildsCom.guilds.push({
                                    name: guildData.name,
                                    icon: guildData.iconURL,
                                    owner: `${memberData.name}#${memberData.discriminator}`,
                                    ownerAvatarURL: memberData.avatarURL
                                });
                            })
                        })
                    })
                })
            })
        })
    }).catch(err => {
        console.error(err);
    });
}

let getBotInfo = () => {
    fetch('http://localhost:3000/api/client').then(response => {
        if (response.status != 200) {
            console.log('Unable to get client info!');
            return;
        }
        response.json().then(data => {
            botInfo.name.name = data.username;
            botInfo.name.discriminator = data.discriminator;
            botInfo.id = data.id
            document.querySelector('.bot-avatar').style.backgroundImage = `url(${data.avatarURL})`
        })
    })
};
getBotInfo();

/* side bar buttons */
Vue.component('side-buttons', {
    props: ['button'],
    template: '<div class="item-sidebar" v-on:click="click"><div class="active-indicator"></div><i class="material-icons">{{ button.icon }}</i><span>{{ button.name }}</span></div>',
    methods: {
        click() {
            let tabClicked = this.$vnode.key;
            
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'none';
            document.querySelector('.item-sidebar.active').classList.remove('active')
            this.$el.classList.add('active');
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'block';
            console.log()
            document.querySelectorAll('.section').forEach(f => {
                f.classList.add('hidden');
            });
            console.log(tabClicked)
            document.querySelector(`.${tabClicked}`).classList.remove('hidden');
            switch(tabClicked) {
                case "overviewTab":
                    sectionName.sectionName = 'Your Bot';
                    getBotInfo();
                    break;
                case "guildsTab":
                    sectionName.sectionName = 'Guilds';
                    getGuildInfo();
            }
        }
    },
    mounted() {
        if (this.$vnode.key == 'overviewTab') {
            this.$el.classList.add('active');
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'block';
        }
    }
});

let sideButtons = new Vue({
    el: '.nav-buttons',
    data: {
        section1: [
            {'icon': 'info', 'name': 'Overview', 'id': 'overviewTab'},
            {'icon': 'group', 'name': 'Guilds', 'id': 'guildsTab'}
        ]
    }
});

let botInfo = new Vue({
    el: '.bot-info',
    data: {
        name: {
            name: 'Bot',
            discriminator: '0000'
        },
        id: 'id'
    }
})