const Discord = require('discord.js')
const bot = new Discord.Client()

const jsonfile = require('jsonfile');
var playlist = require("./playlist.json")

const token = "NzE1MzIwMzE4ODg5MDMzODIw.Xs7lFw.3yfOd5P_e-5FdzqGoIuUT4biA1g"

function messageHandler(key, value, map){
    console.log(key.content)
    if(key){
        let x = key.content.substring(0,1)
        if(key.content.substring(0,3) == "bot" || key.content.substring(0,3) == "bro" || key.author.bot || x == '!' || x == '*' || x == '>') key.delete()
    }
}

function getPlaylist(m, args){
    let jsonTable = playlist.table.find(el => el.name == args[1].toLowerCase())
    if(!jsonTable) {m.reply("le nom que tu m'as donné ne marche pas mon bro ..."); return}
    let textToSend = ""
    let i = 0
    jsonTable.musics.forEach(music => {
        if(music != null){
            textToSend += "<" + i + "> " + music + "\n"
        }
        i += 1
    })

    m.channel.send("Tiens mon bro !")
    m.channel.send("```\n" + textToSend + "```")
}

function addPlaylist(m, args){
    for(let i = 4; i < args.length ; i += 1){
        args[3] +=  " " + args[i]
    }
    args[1] = args[1].toLowerCase()

    playlist = require("./playlist.json")
    let jsonTable = playlist.table.find(el => el.name == args[1])

    if(!jsonTable) {
        playlist.table.push({name : args[1], musics : [args[3]]})
        m.reply("ta playlist a été créée avec " + args[3] + " dedans !")
    }
    else{
        playlist.table.forEach(el => {
            if(el.name == args[1]) el.musics.push(args[3])
        })
        m.reply(args[3] + " à été ajouté à la playlist " + args[1])
    }
    jsonfile.writeFile('playlist.json', playlist, {spaces:2}/*, function(err){if(err != null)console.log(err);}*/);
}

function removePlayList(m, args){
    args[1] = args[1].toLowerCase()

    playlist = require("./playlist.json")
    let jsonTable = playlist.table.find(el => el.name == args[1])
    let done = false
    if(!jsonTable) m.reply("la playlist n'existe pas")
    else{
        playlist.table.forEach(el => {
            if(el.name == args[1]) done = delete el.musics[args[3]]
        })
        if(done) m.reply(args[3] + " à été supprimé de la playlist " + args[1])
        else m.reply(args[3] + " n'a pas été trouvé dans la playlist " + args[1])
    }
    jsonfile.writeFile('playlist.json', playlist, {spaces:2}/*, function(err){if(err != null)console.log(err);}*/);
}

bot.on('ready', () => {
    console.log('Bot is ready')
})

bot.on('message', (m) => {
    if (m.author == bot.user) return
    
    if(m.content.substring(0,3) === "bro" || m.content.substring(0,3) === "bot"){
        let args = m.content.substring(4).split(" ")
        console.log(args)

        switch(args[0].toLowerCase()){
            case 'clear': case 'c':
                m.channel.send("En train de nettoyer mon bro !").then(m => m.delete())
                m.channel.fetch().then(c => {
                    c.messages.fetch().then(m => {
                        m.forEach(messageHandler);
                    })
                })
                break;
            
            case 'coucou': case 'plop': case 'bonjour':
                m.reply("salut mon bro !")
                break;

            case 'playlist': case 'pl': case 'p':
                if(!args[1]) {
                    m.reply("Utilisation de la commande playlist (aliases pl et p) :```> bro playlist <nom de la playlist> (add|delete) (nom|id) ```");
                    return
                }
                else{
                    if(!args[2]) getPlaylist(m, args)
                    else if(!args[3]) {m.reply("Il me faut un nom ou un id pour continuer bro !```> bro playlist <nom de la playlist> (add|delete) (nom|id) ```"); return}
                    else{
                        args[2] = args[2].toLowerCase()
                        if(args[2] == "add" || args[2] == 'a') addPlaylist(m, args)
                        else if(args[2] == "remove" || args[2] == "rem" || args[2] == "r" || args[2] == "delete" || args[2] == "del" || args[2] == "d") removePlayList(m, args)
                        else m.reply("Utilisation de la commande playlist (aliases pl et p) :```> bro playlist <nom de la playlist> (add|delete) (nom|id) ```");
                    }
                }
                break;
            

            case 'help': case 'h':
                m.reply("Voici comment je marche mon bro !")
                m.channel.send("```Mes allias sont bro et bot\n\n bro clear|c > Clear les messages des bots vieux de moins de deux semaines \n bro playlist|pl|p > Aficher ou gerer une playlist \n bro coucou|plop|bonjour > Pour me dire bonjour !```")
                break;

            default:
                m.reply("j'ai pas compris bro ...")
                break;
        }
    }
})

bot.login(token)
