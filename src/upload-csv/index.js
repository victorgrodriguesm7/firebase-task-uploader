const Fs = require('fs');
var admin = require("firebase-admin");
const algoliasearch = require('algoliasearch');

var client = algoliasearch('APP_ID', 'ADMIN_KEY');

var tasksIndex = client.initIndex('YOUR_INDEX');

const CsvReadableStream = require('csv-reader');
var serviceAccount = require("firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let inputStream = Fs.createReadStream('./out/data.csv', 'utf8');
 
let data = [];

function convertToObject(row){
    let [
        status,
        title,
        description,
        onwer_id,
        onwer_name,
        history_1_id,
        history_1_name,
        history_1_action,
        history_2_id,
        history_2_name,
        history_2_action,  
    ] = row;

    let Task = {
        status,
        title,
        description,
        onwer: {
            id: onwer_id,
            name: onwer_name,
        },
        history: [
            {
                id: history_1_id,
                name: history_1_name,
                action: history_1_action,             
            },
            {
                id: history_2_id,
                name: history_2_name,
                action: history_2_action,
            }
        ]
    };

    data.push(Task);
}

function readCSV(){
    inputStream
        .pipe(new CsvReadableStream({ 
            parseNumbers: true, 
            parseBooleans: true, 
            trim: true 
        })).on('data', convertToObject).on('end', function (data) {
            uplodToFirestore();
            uploadToAlgolia();
        });
}

async function uplodToFirestore(){
    let i = 1;
    for (let Task of data){
        await admin.firestore().collection('Tasks').add({
            ...Task
        });
        console.log(`${i} Sent`)
        i++;
    }
}

async function uploadToAlgolia(){
    let i = 1;
    let data = await admin.firestore().collection('Tasks').get();
        
    for (let doc of data.docs){
        let Task = doc.data();
        Task.objectID = doc.id;
        await tasksIndex.saveObject(Task);          
        console.log(`${i} Sent`)
        i++;
    }
}

readCSV();