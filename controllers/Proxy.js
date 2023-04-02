const axios = require("axios");
const cheerio = require("cheerio");
const regexForRelativePath = /(href|src)=("|')\.(\/[^"']*)("|')/g;
const regexForRelativePathWithDot = /(href|src)=("|')\//g;
const cspRegex = /<meta\s+http-equiv="Content-Security-Policy"/i;
const imageTypeRegex = /\.([^.]*$)/;
const websiteRegex = new RegExp("https://buildoor\\.xyz", "gi");
const websiteUrl = "https://buildoor.xyz/";
const config = {
  headers: {
    Origin: "https://buildoor.xyz/",
    Referer: "https://buildoor.xyz/",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    // "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  },
};
exports.sendWebisteContent = async (req, res, next) => {
  console.log("Landed at sendWebisteContent");

  const websiteContent = await axios.get(websiteUrl, config);
  console.log(websiteContent)
  //get array of all path for assests/url
  const updatedWebsiteContent = websiteContent.data.replace(
    regexForRelativePath,
    `$1=$2${"http://localhost:4000/buildoor/"}`
  );
  // update the cross security policy to include our backend and frontend
  const updatedCSPContent = updatedWebsiteContent.replace(
    /<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
    `<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://www.google-analytics.com https://www.googletagmanager.com http://localhost:4000 http://localhost:3000 'unsafe-inline'">`
  );

  const updatedWebsiteURLWithoutDomain = updatedCSPContent.replace(
    websiteRegex,
    "http://localhost:4000/buildoor"
  );
  res.send(updatedWebsiteURLWithoutDomain);
};

// exports.sendWebsiteAssests = async (req, res, next) => {
//   try {
//     // console.log("https://buildoor.xyz/" + req.params[0]);
//     const absoluteUrl = "https://buildoor.xyz/" + req.params[0];
//     console.log(absoluteUrl);
//     const match = absoluteUrl.match(imageTypeRegex);
//     console.log(match)
//     if (match) {
//       console.log("image match");
//       console.log(match);
//       console.log("https://buildoor.xyz/" + req.params[0]);
//       const websiteAssest = await axios.get(
//         "https://buildoor.xyz/" + req.params[0],
//         { ...config, responseType: "arraybuffer" }
//       );
//       const buffer = Buffer.from(websiteAssest.data, "utf-8");
//       console.log(buffer);
//       res.set({ "Content-Type": "image/" + match[1] });
//       res.send(buffer);
//     } else {
//       const websiteAssest = await axios.get(
//         "https://buildoor.xyz/" + req.params[0],
//         config
//       );
//       res.set(websiteAssest.headers);
//       res.set({
//         Connection: "Keep-Alive",
//         "Keep-Alive": "timeout=5, max=100",
//         "content-type": "image/png",
//       });
//       res.send(websiteAssest.data);
//     }
//   } catch (error) {
//     res.send();
//   }
// };
// const axios = require("axios");
// const imageTypeRegex = /\.(jpeg|jpg|png|gif|bmp|svg)$/i;

exports.sendWebsiteAssets = async (req, res, next) => {
  try {
    console.log(req.params)
    const absoluteUrl = "https://buildoor.xyz/" + req.params[0];
    const match = absoluteUrl.match(imageTypeRegex);
    console.log(absoluteUrl)
    if (match) {
      const websiteAsset = await axios.get(
        absoluteUrl,
        { responseType: "arraybuffer" }
      );
      const buffer = await Buffer.from(websiteAsset.data, "binary");
      res.set({ "Content-Type": "image/" + match[1] });
      res.send(buffer);
    } else {
      const websiteAsset = await axios.get(
        absoluteUrl,
        { responseType: "stream" }
      );
      console.log("HEADERS______",websiteAsset.headers);
      res.set(websiteAsset.headers);
      res.set({
        Connection: "Keep-Alive",
        "Keep-Alive": "timeout=5, max=100",
      });
      websiteAsset.data.pipe(res);
    }
  } catch (error) {
    res.status(404).send("Not Found");
  }
};
