import { loadTasks, saveTasks } from "./pohrana.js";

const APP_NAME = "Bilježnica zadataka";
console.log(`== ${APP_NAME} ==`);

const [command, arg1] = process.argv.slice(2);

let tasks;
try {
    tasks = await loadTasks();
} catch (error) {
    console.error(`Datoteka zadaci.json nije ispravna: ${error.message}`);
    process.exit(1);
}

switch (command) {
    case "dodaj": {
        const title = arg1?.trim();
        if (!title) {
            console.error('Korištenje: dodaj "naslov zadatka"');
            process.exit(1);
        }

        let newId = 1;
        if (tasks.length > 0) {
            const maxId = Math.max(...tasks.map((task) => task.id ?? 0));
            newId = maxId + 1;
        }

        tasks.push({ id: newId, naslov: title, gotovo: false });
        await saveTasks(tasks);
        console.log(`Dodano: ${title} (broj ${newId})`);
        break;
    }

    case "popis": {
        if (tasks.length === 0) {
            console.log("Nema zadataka.");
        } else {
            tasks.forEach((task) => {
                const status = task.gotovo ? "[x]" : "[ ]";
                console.log(`${task.id}. ${status} ${task.naslov}`);
            });
        }
        break;
    }

    case "gotovo": {
        if (!arg1 || !/^\d+$/.test(arg1)) {
            console.error("Korištenje: gotovo broj");
            process.exit(1);
        }

        const id = Number(arg1);
        const task = tasks.find((item) => item.id === id);

        if (!task) {
            console.error(`Zadatak broj ${id} ne postoji.`);
            process.exit(1);
        }

        task.gotovo = true;
        await saveTasks(tasks);
        console.log(`Zadatak broj ${id} označen kao gotov.`);
        break;
    }

    default:
        console.error("Nepoznata naredba. Koristi dodaj, popis ili gotovo.");
        process.exit(1);
}