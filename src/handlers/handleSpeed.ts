import globalStore from "@store/globalStore.ts";

const handleSpeed = () => {
    let timer;
    globalStore.speed.onChange(() => {
        clearTimeout(timer);
        timer = setTimeout(() => { // reset speed after 15 sec if no speed updates received
            globalStore.speed.set(0);
        }, 15000);
    });

};

handleSpeed();