const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
console.log(ytRegex.exec('https://www.youtube.com/watch?v=0-t63MHdVd4'));
