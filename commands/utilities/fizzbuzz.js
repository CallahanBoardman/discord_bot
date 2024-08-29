const {
    SlashCommandBuilder,
  } = require('discord.js');
  exports.data = new SlashCommandBuilder().setName('fizzbuzz').setDescription('Returns Fizz if divisible by 3, Buzz if 5 and Fizzbuzz if both').addNumberOption(option => option.setName('numbertofizzbuzz').setDescription('Enter a number').setRequired(true));
  exports.execute = async function (interaction) {
    const fizzbuzzee = interaction.options.getNumber('numbertofizzbuzz') ?? 1;
    let result = fizzbuzzee.toString();
    
    if(fizzbuzzee % 3 === 0) {
        if(fizzbuzzee % 5 === 0) {
            result = "FizzBuzz"
        } else {
            result = "Fizz"
        }
    } else if(fizzbuzzee % 5 === 0) {
        result = "Buzz"
    }
    
    await interaction.reply(result);
  };