const getId = (allIds) => {
    let id = new Date().getTime() & 0x000000ffff;
    while(allIds.includes(id))
        id = new Date().getTime() & 0x000000ffff;
    return id;
};

export default getId;