import { TypedEcosystem } from "models/ecosystem.model";
import fs from "react-native-fs";
import { sha1 } from "react-native-sha1";
import { APP_URL } from "configs/index";

export const FOLDER_CACHE_VIDEO = fs.CachesDirectoryPath + "/video_ecosystem/";

export const Validation = {
  notEmpty: /\S+/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  minLength_8: /^.{8,}$/,
  phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  onlyNumber: /^[0-9]*$/,
  biggerThan_0: /^[1-9][0-9]*$/,
  isURL: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
};

export async function loadCacheMediaToUI(urlMedia: string | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof urlMedia === "string" && urlMedia !== "" && urlMedia.match(Validation.isURL)) {
      getMediaCachePath(urlMedia).then((pathCache) => {
        if (pathCache !== "") {
          resolve("file://" + pathCache);
        } else {
          resolve(urlMedia);
        }
      }).catch(() => {
        resolve(urlMedia);
      });
    } else {
      if (urlMedia !== undefined)
        resolve(urlMedia);
      else
        reject(urlMedia);
    }
  });
}

export const cacheListVideo = async (lists: TypedEcosystem[]) => {
  let listVideoReturn: TypedEcosystem[] = [];
  for (const eco of lists) {
    const linkCache = await getMediaCachePath(eco.video);
    listVideoReturn.push({ ...eco, video: linkCache });
  }

  return listVideoReturn;
};

export async function getMediaCachePath(link: string): Promise<string> {
  /**
   * get SHA1 hash for name file
   */
  let nameFile = await getSha1FromString(link);
  if (nameFile === "")
    return "";
  nameFile = nameFile.replace(/%20/g, "_");

  let isCreateFolder = await createFolder(FOLDER_CACHE_VIDEO);
  if (!isCreateFolder)
    return "";

  return await fs.readDir(FOLDER_CACHE_VIDEO)
    .then(async (result) => {
      let path = "";
      result.forEach((element) => {
        if (element.name.split(".").slice(0, -1).join(".") === nameFile) {
          path = element.path;
        }
      });

      if (path === "") {
        return await downloadFileToPath(link, FOLDER_CACHE_VIDEO + nameFile);
      }
      return path;
    })
    .catch(err => {
      console.log(err);
      return "";
    });
}

async function createFolder(pathFolder: string): Promise<boolean> {
  return fs.exists(pathFolder).then(async function createCacheFolder(result) {
    if (result) {
      return true;
    } else {
      return fs.mkdir(pathFolder, { NSURLIsExcludedFromBackupKey: true }).then(function returnResult(result) {
        return true;
      }).catch(function returnError() {
        return false;
      });
    }
  });
}

export async function getSha1FromString(string: string): Promise<string> {
  return sha1(string).then(function returnResult(result) {
    return result;
  }).catch(function returnEmpty() {
    return "";
  });
}

export async function downloadFileToPath(url: string, path: string): Promise<string> {
  path = String(path || " ").replace(/%20/g, "_");
  let typeFile = "";
  return fs.downloadFile({
    fromUrl: url,
    toFile: path,
    background: true,
    begin: (res) => {
      if (res.statusCode === 200) {
        typeFile = getFileExtensionViaCode(res.headers["Content-Type"]);
      }
    }
  }).promise.then(async (res) => {
    try {
      /**
       * Translate code to extension.
       * @param extCode
       * @returns
       */
      if (typeFile !== "") {
        typeFile = "." + typeFile;
        await fs.moveFile(path, `${path}${typeFile}`);
      }
      return `${path}${typeFile}`;
    } catch (e) {
      return `${path}${typeFile}`;
    }
  })
    .catch(err => {
      console.log("err downloadFile: ", err);
      return "";
    });
}

function getFileExtensionViaCode(mime: string): string {
  let allMimes: any = "{\"png\":[\"image\/png\",\"image\/x-png\"],\"bmp\":[\"image\/bmp\",\"image\/x-bmp\",\"image\/x-bitmap\",\"image\/x-xbitmap\",\"image\/x-win-bitmap\",\"image\/x-windows-bmp\",\"image\/ms-bmp\",\"image\/x-ms-bmp\",\"application\/bmp\",\"application\/x-bmp\",\"application\/x-win-bitmap\"],\"gif\":[\"image\/gif\"],\"jpeg\":[\"image\/jpeg\",\"image\/pjpeg\"],\"xspf\":[\"application\/xspf+xml\"],\"vlc\":[\"application\/videolan\"],\"heic\":[\"image\/heic\"],\"heif\":[\"image\/heif\"],\"wmv\":[\"video\/x-ms-wmv\",\"video\/x-ms-asf\"],\"au\":[\"audio\/x-au\"],\"ac3\":[\"audio\/ac3\"],\"flac\":[\"audio\/x-flac\"],\"ogg\":[\"audio\/ogg\",\"video\/ogg\",\"application\/ogg\"],\"kmz\":[\"application\/vnd.google-earth.kmz\"],\"kml\":[\"application\/vnd.google-earth.kml+xml\"],\"rtx\":[\"text\/richtext\"],\"rtf\":[\"text\/rtf\"],\"jar\":[\"application\/java-archive\",\"application\/x-java-application\",\"application\/x-jar\"],\"zip\":[\"application\/x-zip\",\"application\/zip\",\"application\/x-zip-compressed\",\"application\/s-compressed\",\"multipart\/x-zip\"],\"7zip\":[\"application\/x-compressed\"],\"xml\":[\"application\/xml\",\"text\/xml\"],\"svg\":[\"image\/svg+xml\"],\"3g2\":[\"video\/3gpp2\"],\"3gp\":[\"video\/3gp\",\"video\/3gpp\"],\"mp4\":[\"video\/mp4\",\"audio\/mp4\"],\"m4a\":[\"audio\/x-m4a\"],\"f4v\":[\"video\/x-f4v\"],\"flv\":[\"video\/x-flv\"],\"webm\":[\"video\/webm\"],\"aac\":[\"audio\/x-acc\"],\"m4u\":[\"application\/vnd.mpegurl\"],\"pdf\":[\"application\/pdf\",\"application\/octet-stream\"],\"pptx\":[\"application\/vnd.openxmlformats-officedocument.presentationml.presentation\"],\"ppt\":[\"application\/powerpoint\",\"application\/vnd.ms-powerpoint\",\"application\/vnd.ms-office\",\"application\/msword\"],\"docx\":[\"application\/vnd.openxmlformats-officedocument.wordprocessingml.document\"],\"xlsx\":[\"application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"application\/vnd.ms-excel\"],\"xl\":[\"application\/excel\"],\"xls\":[\"application\/msexcel\",\"application\/x-msexcel\",\"application\/x-ms-excel\",\"application\/x-excel\",\"application\/x-dos_ms_excel\",\"application\/xls\",\"application\/x-xls\"],\"xsl\":[\"text\/xsl\"],\"mpeg\":[\"video\/mpeg\"],\"mov\":[\"video\/quicktime\"],\"avi\":[\"video\/x-msvideo\",\"video\/msvideo\",\"video\/avi\",\"application\/x-troff-msvideo\"],\"movie\":[\"video\/x-sgi-movie\"],\"log\":[\"text\/x-log\"],\"txt\":[\"text\/plain\"],\"css\":[\"text\/css\"],\"html\":[\"text\/html\"],\"wav\":[\"audio\/x-wav\",\"audio\/wave\",\"audio\/wav\"],\"xhtml\":[\"application\/xhtml+xml\"],\"tar\":[\"application\/x-tar\"],\"tgz\":[\"application\/x-gzip-compressed\"],\"psd\":[\"application\/x-photoshop\",\"image\/vnd.adobe.photoshop\"],\"exe\":[\"application\/x-msdownload\"],\"js\":[\"application\/x-javascript\"],\"mp3\":[\"audio\/mpeg\",\"audio\/mpg\",\"audio\/mpeg3\",\"audio\/mp3\"],\"rar\":[\"application\/x-rar\",\"application\/rar\",\"application\/x-rar-compressed\"],\"gzip\":[\"application\/x-gzip\"],\"hqx\":[\"application\/mac-binhex40\",\"application\/mac-binhex\",\"application\/x-binhex40\",\"application\/x-mac-binhex40\"],\"cpt\":[\"application\/mac-compactpro\"],\"bin\":[\"application\/macbinary\",\"application\/mac-binary\",\"application\/x-binary\",\"application\/x-macbinary\"],\"oda\":[\"application\/oda\"],\"ai\":[\"application\/postscript\"],\"smil\":[\"application\/smil\"],\"mif\":[\"application\/vnd.mif\"],\"wbxml\":[\"application\/wbxml\"],\"wmlc\":[\"application\/wmlc\"],\"dcr\":[\"application\/x-director\"],\"dvi\":[\"application\/x-dvi\"],\"gtar\":[\"application\/x-gtar\"],\"php\":[\"application\/x-httpd-php\",\"application\/php\",\"application\/x-php\",\"text\/php\",\"text\/x-php\",\"application\/x-httpd-php-source\"],\"swf\":[\"application\/x-shockwave-flash\"],\"sit\":[\"application\/x-stuffit\"],\"z\":[\"application\/x-compress\"],\"mid\":[\"audio\/midi\"],\"aif\":[\"audio\/x-aiff\",\"audio\/aiff\"],\"ram\":[\"audio\/x-pn-realaudio\"],\"rpm\":[\"audio\/x-pn-realaudio-plugin\"],\"ra\":[\"audio\/x-realaudio\"],\"rv\":[\"video\/vnd.rn-realvideo\"],\"jp2\":[\"image\/jp2\",\"video\/mj2\",\"image\/jpx\",\"image\/jpm\"],\"tiff\":[\"image\/tiff\"],\"eml\":[\"message\/rfc822\"],\"pem\":[\"application\/x-x509-user-cert\",\"application\/x-pem-file\"],\"p10\":[\"application\/x-pkcs10\",\"application\/pkcs10\"],\"p12\":[\"application\/x-pkcs12\"],\"p7a\":[\"application\/x-pkcs7-signature\"],\"p7c\":[\"application\/pkcs7-mime\",\"application\/x-pkcs7-mime\"],\"p7r\":[\"application\/x-pkcs7-certreqresp\"],\"p7s\":[\"application\/pkcs7-signature\"],\"crt\":[\"application\/x-x509-ca-cert\",\"application\/pkix-cert\"],\"crl\":[\"application\/pkix-crl\",\"application\/pkcs-crl\"],\"pgp\":[\"application\/pgp\"],\"gpg\":[\"application\/gpg-keys\"],\"rsa\":[\"application\/x-pkcs7\"],\"ics\":[\"text\/calendar\"],\"zsh\":[\"text\/x-scriptzsh\"],\"cdr\":[\"application\/cdr\",\"application\/coreldraw\",\"application\/x-cdr\",\"application\/x-coreldraw\",\"image\/cdr\",\"image\/x-cdr\",\"zz-application\/zz-winassoc-cdr\"],\"wma\":[\"audio\/x-ms-wma\"],\"vcf\":[\"text\/x-vcard\"],\"srt\":[\"text\/srt\"],\"vtt\":[\"text\/vtt\"],\"ico\":[\"image\/x-icon\",\"image\/x-ico\",\"image\/vnd.microsoft.icon\"],\"csv\":[\"text\/x-comma-separated-values\",\"text\/comma-separated-values\",\"application\/vnd.msexcel\"],\"json\":[\"application\/json\",\"text\/json\"]}";
  allMimes = JSON.parse(allMimes);
  for (let key in allMimes) {
    if (allMimes[key].indexOf(mime) > -1) {
      return key;
    }
  }
  return "";
}

export function getMediaLink(fileName: string) {
  return APP_URL.MEDIA_DOWNLOAD + "/" + fileName;
}
