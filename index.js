const Discord = require("discord.js");
const ms = require("ms");


const client = new Discord.Client();


const config = require("./config.json");

client.on("ready", () => {
 
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity('видосы Деда Бюрера', { type: 'WATCHING' });
});


client.on("message", async message => {

  if(message.author.bot) return;
  

  if(message.content.indexOf(config.prefix) !== 0) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  


///////////////фичи

/// ПРИВЕТ






  
///////////////комманды

  ///пинг
  if(command === "пинг") {
 
    const m = await message.channel.send("понг!)");
    return;
  }

  ///кик
  if(command === "кик") {

    if(!message.member.roles.some(r=>["Внучёчки", "Дед Бюрер"].includes(r.name)) )
      return message.reply("Ты не модератор!");
    

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Кого кикать-то?!");
    if(!member.kickable) 
      return message.reply("Этого человека нельзя кикнуть...");
      if(member.hasPermission(`MANAGE_MESSAGES`)) 
      return message.reply("Этого человека нельзя кикнуть...");

    

    let reason = args.slice(1).join(' ');
    if(!reason) 
    return message.reply("Укажи причину кика.");
    

    await member.kick(reason)
      .catch(error => message.reply(`Прости, ${message.author} я не могу кикнуть потому, что : ${error}`));
    message.reply(`${member.user.tag} был кикнут ${message.author.tag}, потому что: ${reason}`);
return;
  }
  
  ///бан
  if(command === "бан") {

    if(!message.member.roles.some(r=>["Внучёчки", "Дед Бюрер"].includes(r.name)) )
      return message.reply("Ты не модератор!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Кого кикать-то?");
    if(!member.bannable) 
    return message.reply("Этого человека нельзя забанить...");

    let reason = args.slice(1).join(' ');
    if(!reason) 
    return message.reply("Укажи причину кика.");
    
    await member.ban(reason)
      .catch(error => message.reply(`Прости, ${message.author} я не могу кикнуть потому, что : ${error}`));
      message.reply(`${member.user.tag} был забанен ${message.author.tag}, потому что: ${reason}`);
      return;
  }
  
  /// Удалить
  if(command === "удалить") {
 
    const deleteCount = parseInt(args[0], 10);
    
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Укажи количество сообщений к удалению (до 100)");
    
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Не могу удалить сообщения потому, что: ${error}`));
      return;
  }


  ///МУТ
  if(command === "мут") {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Ты не модератор!");
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("Нет такого среди нас.");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Это модератор!");
    let reason = args.slice(2).join(" ");
    if(!reason) return message.reply("Укажи причину.");
  
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    let mutetime = args[1];
    if(!mutetime) return message.reply("YУкажи время!");
  
    message.delete().catch(O_o=>{});
  
    try{
      await tomute.send(`Ты был замьючен на сервере деда на ${mutetime} по причине ${reason}. Не шали!`)
    }catch(e){
      message.channel.send(`Пользователь был замьючен... но его лс закрыто. Мут на ${mutetime}`)
    }
  
    let muteembed = new Discord.RichEmbed()
    .setDescription(`Mute executed by ${message.author}`)
    .setColor("#0000000")
    .addField("Muted User", tomute)
    .addField("Muted in", message.channel)
    .addField("Time", message.createdAt)
    .addField("Length", mutetime)
    .addField("Reason", reason);
  
    let incidentschannel = message.guild.channels.find(`name`, "лог");
    if(!incidentschannel) return message.reply("Укажи лог в коде.");
    incidentschannel.send(muteembed);
  
    await(tomute.addRole(muterole.id));
  
    setTimeout(function(){
      tomute.removeRole(muterole.id);
    }, ms(mutetime));
}



});
client.login(config.token);

