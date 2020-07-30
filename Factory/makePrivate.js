// This pattern make staff become private.
function factory(){
    const staff = {};
    const engineer = {
        getStaff: name => {
            if(!name) throw new Error('INVALID NAME');
            return staff[name];
        },
        setStaff: (name, value) => {
            if(!name) throw new Error('INVALID NAME');
            if(!value) throw new Error('INVALID VALUE');
            staff[name] = value;
        }
    }
    return engineer;
}

const engineer = factory();
engineer.setStaff('Khang', 'Dep trai');
console.log(engineer.getStaff('Khang')); //Dep trau
console.log(engineer.staff); //undefined