import bcrypt from 'bcryptjs';

export default {
    tasks: [
        {
            title: 'Diseñar la Home',
            responsible: '',
            isCompleted: false,
        },
        {
            title: 'Programar la Home',
            responsible: '',
            isCompleted: false,
        },
        {
            title: 'Testear la Home',
            responsible: '',
            isCompleted: false,
        },
    ],
    users: [
        { name: 'Pepe', passwd: bcrypt.hashSync('1234'), tasks: [] },
        { name: 'Elena', passwd: bcrypt.hashSync('1234'), tasks: [] },
    ],
};
