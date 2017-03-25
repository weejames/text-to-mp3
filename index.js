/*globals Promise:false*/
/*globals Buffer:false*/

const MercuryClient = require('mercury-client');
const htmlToText = require('html-to-text');
const AWS = require('aws-sdk');
const FS = require('fs');
const slug = require('slug');

if (!process.env.MERCURY_API_KEY) process.exit(1);

const mc = new MercuryClient(process.env.MERCURY_API_KEY);

// Create a Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1',
});

mc.parse(process.argv[2])
    .then((data) => {

        const text = htmlToText.fromString(data.content, {
            wordwrap: null,
            ignoreHref: true,
            ignoreImage: true,
            singleNewLineParagraphs: true,

        });

        let textParts = text.split("\n");
        let speech = [];

        textParts.unshift(data.title);

        textParts.forEach( (string) => {

            string = `<speak>${string}<break time='1s' /></speak>`;

            let params = {
                'Text': string,
                'OutputFormat': 'mp3',
                'VoiceId': 'Emma',
                'TextType': 'ssml'
            }

            speech.push(Polly.synthesizeSpeech(params).promise());

        });

        Promise.all(speech).then( (audio) => {
            const audioStreams = audio.map(a => a.AudioStream);
            const buffer = Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))

            if (buffer instanceof Buffer) {
                FS.writeFile(`./${slug(data.title)}.mp3`, buffer);
            }
        });

    })
    .catch( () => {
        process.exit(1);
    });
