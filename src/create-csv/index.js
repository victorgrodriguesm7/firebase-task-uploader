var faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const possiblesOnwer = [
    {
        id: '',
        name: ''
    },
    {
        id: '',
        name: ''
    },
    {
        id: '',
        name: ''
    },
    {
        id: '',
        name: ''
    }
]

const possibleStatus = [
    'Pendente',
    'Em Andamento',
    'Finalizado',
    'Cancelado'
]

const csvWriter = createCsvWriter({
    path: './out/data.csv',
    header: [
        {id: 'status', title: 'Status'},
        {id: 'title', title: 'Title'},
        {id: 'description', title: 'Description'},
        {id: 'onwer_id', title: 'Onwer_Id'},
        {id: 'onwer_name', title: 'Onwer_Name'},
        {id: 'history_1_id', title: 'History_1_Id'},
        {id: 'history_1_name', title: 'History_1_Name'},
        {id: 'history_1_action', title: 'History_1_Action'},
        {id: 'history_2_id', title: 'History_2_ID'},
        {id: 'history_2_name', title: 'History_2_Name'},
        {id: 'history_2_action', title: 'History_2_Action'},
    ]
});

function generateData(){
    let data = [];

    for (let i = 0; i < 19999; i++){

        const title = faker.name.title();

        const status = possibleStatus[faker.datatype.number({
            min: 0,
            max: possibleStatus.length - 1
        })];

        const description = faker.commerce.productDescription();

        const onwer = possiblesOnwer[faker.datatype.number({
            min: 0,
            max: possibleStatus.length - 1
        })];

        data.push({
            status,
            title,
            description,
            onwer_id: onwer.id,
            onwer_name: onwer.name,
            history_1_id: onwer.id,
            history_1_name: onwer.name,
            history_1_action: `${onwer.name} Criou essa Tarefa`,
            history_2_id: onwer.id,
            history_2_name: onwer.name,
            history_2_action: `${onwer.name} Definiu essa Tarefa como ${status}`
        });
    }

    return data;
}

const records = generateData();

csvWriter.writeRecords(records)
    .then(() => {
        console.log('...Done');
    }
);