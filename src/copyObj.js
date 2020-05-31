const copyObj = obj => {
    if(obj === undefined) throw new Error('Object is undefined');
    return JSON.parse(JSON.stringify(obj));
};

export default copyObj;