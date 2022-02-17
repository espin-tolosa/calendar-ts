// Implementation of unique id with closures to cache previous hashes
// To make it really usefull in the context of React I'll need to add following features:
// 1. global caching for the entire app
// 2. memoize already given hashes to avoid hashing redistribution in following renders
//		one solution:

//	... within the component ...
//	const uid = uniqueID() //a way to access the closure but it won't be like that
//	const [componentID, _] = useState( uid() )

export function uniqueID() {
  const cachedID = [""];

  const makeid = (length = 8) => {
    const charSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let idFound = 1;
    let result = "";
    while (idFound > 0) {
      result = "";
      for (let i = 0; i < length; i++) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
      }
      idFound = cachedID.findIndex((uid) => uid === result);
    }

    cachedID.push(result);
    console.log("cached", cachedID);

    return result;
  };
  return makeid;
}
