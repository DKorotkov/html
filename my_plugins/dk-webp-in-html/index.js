const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through2');

const pluginName = 'dk-webp-in-html';

module.exports = function () {
  var source = {
    extensions: ['.webp', 'original'],
    media: ['min-width: 1024px', 'min-width: 601px', 'max-width: 600px'],
    subname: ['extralarge', 'large', 'small'],
    data: ['', '2x', '3x']
  };

  var extensions = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG'];
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    if (file.isStream()) {
      cb(new PluginError(pluginName, 'Streaming not supported'));
      return;
    }
    try {
      var SplitPicture = '<picture>';
      var RePicture = /([\s\S]*?<\/picture>)([\s\S]*)/;

      var SplitImg = '<img ';
      var ReImg1 = /<img([^>]*)src=[\"\'](\S+)[\"\']([^>]*)>/;
      var ReImg = /<img([^>]*)data-src=[\"\'](\S+)[\"\']([^>]*)>/;

      var bgImg = 'data-bgset';
      var bgImgX = /data-bgset=[\"\'](\S+)[\"\']([^>]*)>/;

      //
  


        var data = file.contents.toString() // Переводим весь документ в строки
              .split(bgImg)
              .map(function (subLine) { // Создаем из всех нахождений массив?
                var bglineImg = (bgImg + subLine).toString();
                 if (bgImgX.test(bglineImg)) { // проверяем есть ли вообще img
                    var regexpArray = bglineImg.match(bgImgX); // если есть, то выдергиаем diva из контекста
                    var newUrl = regexpArray[1]; // записали только его путь
                    if (newUrl.indexOf('.webp') < 0) { 
                      source.extensions[1] = newUrl.slice(newUrl.lastIndexOf('.'));
                      var fileName = newUrl.slice(newUrl.lastIndexOf('/'), newUrl.lastIndexOf('.'));
                      var filePath = newUrl.slice(0, newUrl.lastIndexOf('/'));
                      var dataTag = '';
                      var sourceTag = '';
                      source.extensions.forEach(function (item, i) {
                          for (let j = 0; j < source.media.length; j++) {
                            for (let l = 0; l < source.data.length; l++) {
                              var str = '';
                              if (source.data[l] != '') str = '@';
                              dataTag += filePath + fileName + fileName + '-' + source.subname[j] + str + source.data[l] + source.extensions[i] + str.replace('@', ' ') + source.data[l] + ', ';
                            }
                            dataTag = dataTag.slice(0, dataTag.lastIndexOf(',')) + '';
                            sourceTag += dataTag + ' [(' + source.media[j] + ')] | ';
                            dataTag = '';
                          }
                        });
                        sourceTag = sourceTag.slice(0, sourceTag.lastIndexOf('|')) + '';
                      subLine = bglineImg.replace(newUrl, sourceTag);
                      subLine = subLine.replace('data-bgset', '');
                    }
                  }
                return subLine;
              })
              .join(bgImg);

      file.contents = new Buffer(data);
      this.push(file);

          data = file.contents.toString() // Переводим весь документ в строки
        .split(SplitPicture) // разделяемя на блоки по совпадению "<picture>"
        .map(function (line) { // Создаем новый массив из этих блоков, в line записываем полчившийся резуьтат
          var picture = '';
          if (RePicture.test(line)) { //Проверяет есть ли "<picture>" в line
            var lineA = line.match(RePicture); //Если есть, то делим на элементы массива "<picture>" и все остальное
            picture = lineA[1]; // Сюда записываем элемент "<picture>"
            line = lineA[2]; // Сюда записываем все остальное
          }

          if (~line.indexOf(SplitImg)) { // Проверяем во всем тексте кроме "<picture>" нахождение тега <img> ?
            var lineNew = line
              .split(SplitImg)
              .map(function (subLine) { // Создаем из всех нахождений массив?
                var lineImg = (SplitImg + subLine).toString();
                if (ReImg1.test(lineImg)) { // проверяем есть ли вообще img
                  var regexpArray = lineImg.match(ReImg1); // если есть, то выдергиаем img из контекста
                  var imgTag = regexpArray[0]; // записали полность img
                  var newUrl = regexpArray[2]; // записали только его путь
                  
                  if (newUrl.indexOf('.webp') < 0) {
                    if (regexpArray[1].indexOf('data-src') > 0) {
                      var pathStart = regexpArray[1].indexOf('data-src=');
                      var datasrc = regexpArray[1].slice(pathStart);
                      datasrc = datasrc.slice(datasrc.indexOf("/"));
                      var pathEnd = datasrc.indexOf(' ') - 1;
                      datasrc = datasrc.slice(0, pathEnd);

                      // console.log("datasrc - " + datasrc );
                      source.extensions[1] = datasrc.slice(datasrc.indexOf('.')); // Сюда записывает расширение оригинального файла
                      // console.log("extensions - " + source.extensions[1]);
                      // console.log("newUrl - " + newUrl);
                      
                      var fileName = datasrc.slice(datasrc.lastIndexOf('/'), datasrc.indexOf('.'));
                      //  console.log("fileName - " + fileName);
                      var filePath = datasrc.slice(0, datasrc.lastIndexOf('/'));
                      // console.log("filePath - " + filePath);

                      var newHTML = '<picture>';
                      var dataTag;
                      var sourceTag = '';
                    
                    // for (let i=0; i < source.extensions.length; i++) {
                      source.extensions.forEach(function (item, i) {
                          for (let j = 0; j < source.media.length; j++) {
                            var cls = '';
                            if (~imgTag.indexOf("lazyload")){
                              dataTag = 'data-srcset="';
                              // cls = 'class="lazyload"';
                            } 
                            else dataTag = 'srcset="';
                            for (let l = 0; l < source.data.length; l++) {
                              var str = '';
                              if (source.data[l] != '') str = '@';
                              dataTag += filePath + fileName + fileName + '-' + source.subname[j] + str + source.data[l] + source.extensions[i] + str.replace('@', ' ') + source.data[l] + ', ';
                            }
                            dataTag = dataTag.slice(0, dataTag.lastIndexOf(',')) + '"';
                            sourceTag += '<source media="(' + source.media[j] + ')" ' + dataTag + '>';
                          }
                          newHTML += sourceTag;
                          sourceTag = '';
                        });
                        var newImgtag = imgTag.replace(datasrc, filePath + fileName + fileName + '-extralarge' + source.extensions[1]);
                       // newImgtag = newImgtag.replace('src','data-src');
                        newHTML += newImgtag + '</picture>';
                        
                      subLine = lineImg.replace(imgTag, newHTML);
                    }
                    else {
                      // проверяем не webp ли он случайно, если нет, то продолжаем
                        for (var k in extensions) {
                          newUrl = newUrl.replace(extensions[k], '.webp');
                        }
                        var newHTML = '<picture><source srcset="' + newUrl + '" type="image/webp">' + imgTag + '</picture>';
                        subLine = lineImg.replace(imgTag, newHTML);
                      }
                  }
                }
                return subLine;
              })
              .join('');
            line = lineNew; // Сюда записываем новую строку после формирования
          }
          return picture + line; // записываем новую строку и старую информацию в тэге picture
        })
        .join(SplitPicture); // доавляем в файл
      //
      file.contents = new Buffer(data);
      this.push(file);
    } catch (err) {
      this.emit('error', new PluginError(pluginName, err));
    }
    cb();
  });
};
