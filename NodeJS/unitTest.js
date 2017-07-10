var crypto = require('crypto');
var encryptor = require("./encryption");

exports.testCryptoEnabled = function(test)
{
    test.ok(crypto != null, "crypto is not available");
    test.done();
};

exports.simpleText = function(test) 
{
    var text = "  Hello World  ";
    var key = "44 52 d7 16 87 b6 bc 2c 93 89 c3 34 9f dc 17 fb 3d fb ba 62 24 af fb 76 76 e1 33 79 26 cd d6 02";

    var encryptedText = encryptor.encryptData(text, key);
    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, text);    
    test.done();
};

exports.sameKey = function(test)
{
    var text = "  Hello World  ";
    var key = "44 52 d7 16 87 b6 bc 2c 93 89 c3 34 9f dc 17 fb 3d fb ba 62 24 af fb 76 76 e1 33 79 26 cd d6 02";

    var encryptedText = encryptor.encryptData(text, key);

    key = key.toUpperCase();
    key = key.replace(new RegExp(' ', 'g'), '');

    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, text);    
    test.done();
};

exports.wrongKey = function(test)
{
    var text = "Hello!";
    var key = "4f 07 76 f2 72 0b c4 ce 31 e2 6e bb 19 26 f7 9f cc 38 fa f0 e3 68 b6 81 cb 09 d6 df f3 e5 eb 49";

    var encryptedText = encryptor.encryptData(text, key);

    key = "4e 07 76 f2 72 0b c4 ce 31 e2 6e bb 19 26 f7 9f cc 38 fa f0 e3 68 b6 81 cb 09 d6 df f3 e5 eb 49";
    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, null);    
    test.done();
};

exports.decryptOnly = function(test)
{
    var encryptedText = "df78cedebfb70624bb663a2eb8ba828adf78cedebfb70624bb663a2eb8ba828a9B354CBA0AB6F7763A88F04D83A237462BE1B68F8D2CFCD4FCDC575BE51333B431A45E86D9B9B5D21DBD91C044DA118C783D98F89E28911463F957E2DA3188F1F4615F637B7F089F6DAEFA352EABAF1AC6731C6E67D0644E36E8D5AFACEF3DC7795E0909DFF84CF92E773A0268F9C2F01232F0AC7E1152F4E3802B09CAC5B0E421DDEC41F55A56001E1D37CBD9E2865567E1ABF5A2B2F160EAD80B147F0A1A9B";
    var key = "3c 36 38 36 cf 4e 16 66 66 69 a2 5d a2 80 a1 86 1b 81 bd ff f9 75 71 38 c3 a7 06 05 a4 b2 f2 ce";
    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, "สวัสดีชาวโลก || $ ¢ € Й ﯚ Å || 1234567890 || The quick brown fox jumps over the lazy dog.");
    test.done();
};

exports.UTF8Text = function(test)
{
    var text = "สวัสดีชาวโลก $ ¢ € Й ﯚ Å";
    var key = "44 52 d7 16 87 b6 bc 2c 93 89 c3 34 9f dc 17 fb 3d fb ba 62 24 af fb 76 76 e1 33 79 26 cd d6 02";

    var encryptedText = encryptor.encryptData(text, key);
    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, text);
    test.done();
};

exports.LongText = function(test)
{
    var text = "สวัสดีชาวโลก $ ¢ € Й ﯚ Å || The quick brown fox jumps over the lazy dog. 1234567890! \n This is second line! \t this is tab!";
    var key = "4f 07 76 f2 72 0b c4 ce 31 e2 6e bb 19 26 f7 9f cc 38 fa f0 e3 68 b6 81 cb 09 d6 df f3 e5 eb 49";

    var encryptedText = encryptor.encryptData(text, key);
    var decryptedText = encryptor.decryptData(encryptedText, key);

    test.equals(decryptedText, text);
    test.done();
};

exports.invalidKey = function(test)
{
    var text = "  Hello World  ";
    var key = "44 52 d7 87 b6 bc 2c 93 89 c3 34 9f dc 17 fb 3d fb ba 62 24 af fb 76 76 e1 33 79 26 cd d6 02";

    try
    {
        var encryptedText = encryptor.encryptData(text, key);

        throw new Error("Exception thrown expected because key length is invalid");
    }
    catch (E)
    {
        test.equals(E.message, "key length is not 256 bit (64 hex characters)");
    }

    try
    {
        var decryptedText = encryptor.decryptData("249ec2837616f746f0055f3cc43adbddB403B528EBDF9AF29126BD70D85C904BF3F25748FB22898E1E837FE9D67133ED6DF2F70882CF2EF5060A1E87250AF92762479E4858159AADFC512052DA00630339663ED7DC359A9B02EC40B67E0E12F3E3CA6723D2E18CA1F239CDF0486F0B7D28C2A730C3DA4A0342A2D1C02D833839BDF6819610A2FBC34CFA0AB4C64A9352", key);

        throw new Error("Exception thrown expected because key length is invalid");
    }
    catch (E)
    {
        test.equals(E.message, "key length is not 256 bit (64 hex characters)");
    }

    test.done();
};

exports.zeroByteKey = function(test)
{
    var text = "  Hello World  ";
    var key =  "44 00 d7 ee 87 b6 bc 2c 93 89 c3 34 9f dc 17 fb 3d fb ba 62 24 af fb 76 76 e1 33 79 26 cd d6 02";

    try
    {
        var encryptedText = encryptor.encryptData(text, key);

        throw new Error("Exception thrown expected because key has zero byte");
    }
    catch (E)
    {
        test.equals(E.message, "key cannot contain zero byte block");
    }

    try
    {
        var decryptedText = encryptor.decryptData("249ec2837616f746f0055f3cc43adbddB403B528EBDF9AF29126BD70D85C904BF3F25748FB22898E1E837FE9D67133ED6DF2F70882CF2EF5060A1E87250AF92762479E4858159AADFC512052DA00630339663ED7DC359A9B02EC40B67E0E12F3E3CA6723D2E18CA1F239CDF0486F0B7D28C2A730C3DA4A0342A2D1C02D833839BDF6819610A2FBC34CFA0AB4C64A9352", key);

        throw new Error("Exception thrown expected because key has zero byte");
    }
    catch (E)
    {
        test.equals(E.message, "key cannot contain zero byte block");
    }

    test.done();
};