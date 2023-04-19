import { Configuration, OpenAIApi } from 'openai';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import {
  // getTenorGifs,
  getRandomNum,
  getRandomColor,
  prepareEmbed,
  sendEmbed,
  birdLog,
} from '../lib/helpers.js';
import { initNationalDayData } from '../lib/national-day.js';

const { OPEN_AI_API_KEY } = process.env;

export default {
  data: new SlashCommandBuilder()
    .setName('national-day')
    .setDescription(
      'Random day from National Day Calendar (w/ possibly related AI-generated image)',
    ),
  async execute(interaction) {
    await interaction.deferReply();
    
    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const randomColor = getRandomColor();

    const nationalDayData = await initNationalDayData();

    const randomNum = getRandomNum(nationalDayData.length);
    const { title, description, link } = nationalDayData[randomNum];

    // let searchTermArray = title.split(' ');
    // const startTermsToRemove = ['national', 'international', 'world'];
    // if (startTermsToRemove.includes(searchTermArray[0].trim().toLowerCase())) {
    //   searchTermArray.shift();
    // }
    // const endTermsToRemove = ['day', 'eve'];
    // if (
    //   endTermsToRemove.includes(
    //     searchTermArray[searchTermArray.length - 1].trim().toLowerCase(),
    //   )
    // ) {
    //   searchTermArray.pop();
    // }
    // const searchTerm = searchTermArray.join(' ').toLowerCase();
    // const nationalDayGifs = await getGiphyGifs({ searchTerm });
    // let nationalDayGifs = await getTenorGifs({ searchTerm });
    // if (!nationalDayGifs.length) {
    //   nationalDayGifs = await getTenorGifs({ searchTerm: 'swedish chef' });
    // }
    // const randomGifNum = getRandomNum(nationalDayGifs.length);
    // // const randomGif = nationalDayGifs[randomGifNum].images.original.url;
    // const randomGif = nationalDayGifs[randomGifNum].media_formats.gif.url;

    const textPrompt = `Extract the topic in three words or less (do not return the words "day", "week", "month", "national", or "international") from the following text: ${description}`;
    const textResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: textPrompt,
        },
      ],
      temperature: 0.3,
      user: interaction.user.id,
    });

    // console.log(textPrompt);
    // console.log(textResponse.data.choices[0].message.content);

    const aiSummary = textResponse.data.choices[0].message.content;
    birdLog(`[/national-day] ${aiSummary}`);

    const imagePrompt = `action shot of ${aiSummary}, photo, detailed image`;
    const imageResponse = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      user: interaction.user.id,
    });
    const aiImage = imageResponse.data.data[0].url;
    const aiImageName = `${uuidv4()}.png`;

    const embedFile = new AttachmentBuilder(aiImage, { name: aiImageName });

    // birdLog(`[/national-day] ${aiImage}`);

    const haikuPrompt = `Generate a haiku about the subject: ${aiSummary}`;
    const haikuResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: haikuPrompt,
        },
      ],
      temperature: 0.2,
      user: interaction.user.id,
    });
    const haiku = haikuResponse.data.choices[0].message.content;

    const nationalDayEmbed = prepareEmbed({
      embedTitle: title,
      embedColor: randomColor,
      embedDescription: `${description} [Read More](${link})\n\n**Haiku**\n${haiku}`,
      embedImage: `attachment://${aiImageName}`,
      embedUrl: link,
    });
    birdLog(`[/national-day] ${title}`);
    return await sendEmbed({
      interaction,
      content: nationalDayEmbed,
      file: embedFile,
      reaction: '📅',
    });
  },
};
