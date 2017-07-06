var crypto = require('crypto');

module.exports = 
{
    'generateRandomHex': function(byteLength) 
    { 
        var stringLength = byteLength * 2;

        var alphabet = "abcdef0123456789";
        var s = "";

        for (var i = 0; i < stringLength; i++)
        {
            var r = Math.floor(Math.random()*alphabet.length);

            s += alphabet[r];
        }

        //prevent null block.
        s = s.replace(new RegExp("00", 'g'), "11");

        return s;
    },

    '_dataFromHexString': function (hexString)
    {
        hexString = hexString.trim();
        hexString = hexString.replace(new RegExp(' ', 'g'), '');
        hexString = hexString.toLowerCase();

        var i;
        for(i=0;i<hexString.length;i++)
        {
            if("abcdef0123456789".indexOf(hexString[i]) == -1)
            {
                throw new Error('Invalid encryption hex data');
            }
        }

        var buffer = Buffer.from(hexString, 'hex');;
        return buffer;
    },

    '_dataToHexString': function(buffer)
    {
        var hex = buffer.toString('hex')

        return hex;
    },

    'encryptData': function(plainText, hexKey)
    {
        var hexIV = this.generateRandomHex(16);
        var hexString = Buffer.from(plainText, 'utf8').toString('hex');

        var cipherHexStr = this._encryptData(hexString, hexKey, hexIV);
        var encryptData = hexIV + cipherHexStr;

        return encryptData;
    },

    'decryptData': function(hexStr, hexKey)
    {
        var hexIV = hexStr.substr(0, 32);
        var encryptedStr = hexStr.substr(32);

        var decryptedStr = this._decryptData(encryptedStr, hexKey, hexIV);
        var plainText = Buffer.from(decryptedStr, 'hex').toString('utf8');
        
        return plainText;
    },

    '_checkKey': function(hexKey)
    {
        hexKey = hexKey.trim();
        hexKey = hexKey.replace(new RegExp(' ', 'g'), '');
        hexKey = hexKey.toLowerCase();

        if(hexKey.length != 64)
        {
            throw new Error("key length is not 256 bit (64 hex characters)");
        }

        var i;
        for(i=0;i<hexKey.length;i+=2)
        {
            if(hexKey[i] == '0' && hexKey[i+1] == '0')
            {
                throw new Error("key cannot contain zero byte block");
            }
        }
    },

    '_encryptData': function(hexString, hexKey, hexIV)
    {
        this._checkKey(hexKey);

        var data = this._dataFromHexString(hexString);
        var key = this._dataFromHexString(hexKey);
        var iv = this._dataFromHexString(hexIV);

        var cipher = crypto.createCipheriv('aes256', key, iv);
        //var encryptedBufferData = Buffer.concat([cipher.update(data), cipher.final()]); 
        var encryptedData = cipher.update(data, 'binary', 'hex')  + cipher.final('hex');

        return encryptedData;
    },

    '_decryptData': function(hexString, hexKey, hexIV)
    {
        this._checkKey(hexKey);

        var data = this._dataFromHexString(hexString);
        var key = this._dataFromHexString(hexKey);
        var iv = this._dataFromHexString(hexIV);

        var decipher = crypto.createDecipheriv('aes256', key, iv);
        //var encryptedBufferData = Buffer.concat([cipher.update(data), cipher.final()]); 
        var decryptedData = decipher.update(data, 'binary', 'hex') + decipher.final('hex');

        return decryptedData;
    }
};
