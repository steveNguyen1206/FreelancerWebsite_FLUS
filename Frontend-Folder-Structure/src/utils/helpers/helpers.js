const formattedDateString = function(originalDateString) {

    // const originalDateString = "2023-12-20T08:37:13.000Z";
    console.log(originalDateString)
    const originalDate = new Date(originalDateString);
    
    // Format the date
    const day = originalDate.getDate().toString().padStart(2, '0');
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours().toString().padStart(2, '0');
    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
    
    // Create the formatted string
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const helpers = {
    formattedDateString,
   };
   
   export default helpers;