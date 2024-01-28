/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AssetType } from '../_common/enums/asset-type.enum';
import { Brand } from '../_common/enums/brand.enum';
import { Locale } from '../_common/types/locale.type';

const { ObjectId } = require('mongodb');

export const mockData = {
  assetConfig: {
    [Brand.Dcards]: {
      cards: 'undefined/assets/api/card.json',
      categories: 'undefined/assets/api/catagory.json'
    },
    [AssetType.mediumThumbnail]: 'undefined/edible-com/image/private/t_thumb_med,f_auto,q_auto/Creative-Marketing/Printibles',
    [AssetType.thumbnail]: 'undefined/edible-com/image/private/t_thumb,f_auto,q_auto/Creative-Marketing/Printibles',
    [AssetType.gallery]: 'undefined/edible-com/image/private/t_gallery,f_auto,q_auto/Creative-Marketing/Printibles',
    [AssetType.editor]: 'undefined/edible-com/image/private/t_editor,f_auto,q_auto/Creative-Marketing/Printibles',
    [AssetType.print]: 'undefined/edible-com/image/private/t_print/Creative-Marketing/Printibles'
  },
  featureStatuses: {
    photoCardsEnabled: false,
    overlayCardsEnabled: false,
    authTokenEnabled: false,
    cloudinaryEnabled: false
  },
  order:
  {
    _id: ObjectId('5fb21ac4ec2fce19946233c8'),
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUxMTU4ODM0NQ==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    customer_text: 'asd',
    definition_id: 'VeteransDay_A',
    ea_order_number: null,
    create_date: new Date('2020-11-16T10:57:06.787Z'),
    update_date: new Date('2020-11-16T10:57:06.787Z'),
    last_print_attempt_date: null,
    last_print_success_date: null,
    print_attempts_count: 0,
    print_successes_count: 0,
    printible_type: 'card',
    print_attempts: [],
    print_successes: [],
    origin_api_version: 'development',
    fulfillment_date: null,
    ea_store_number: null,
    app_version: process.env.APP_VERSION,
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20210101.1',
    brand: Brand.Dcards
  },
  existingOrder: {
    _id: ObjectId('5fbbccd36a0c1653010b74b8'),
    ea_order_number: '12345',
    create_date: new Date('2020-11-23T14:53:07.417Z'),
    update_date: new Date('2020-11-23T14:54:28.572Z'),
    last_print_attempt_date: null,
    last_print_success_date: null,
    print_attempts_count: 0,
    print_successes_count: 0,
    printible_type: 'card',
    print_attempts: [],
    print_successes: [],
    origin_api_version: 'development',
    fulfillment_date: null,
    ea_store_number: '12345',
    definition_id: 'Thanksgiving_A',
    customer_text: 'testing',
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNjE0MzE3ODk0Mg==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    app_version: process.env.APP_VERSION,
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20210101.1',
    brand: Brand.Dcards
  },
  file:
  {
    destination: 'destination',
    filename: 'filename',
    path: 'path',
    fieldname: 'file',
    originalname: 'blob',
    encoding: '7bit',
    mimetype: 'image/jpg',
    buffer: Buffer.from('89504e470d0a1a0a0000000d494844520000007e000000c80803000000196ea5d2000000d2504c544547704cdbe7dee4ede6c1d7c6f5f9f6fcfefce0eae2ffffffc7dbcbf9fbf9eed1d14f9d65459a5ee8f0eafcf5f6f6e6e6c93e3ebcd4c1c40000f2f7f358a06cfaf0f0ebc8c8cdded0fef9faf1d7d7eff4f0d6e4d9fffcfdd1e1d5ecf3ee79ae86f4e1e1f8ebebf2dcdcc8363693bc9db7d1bd3b9858e5b8b8c72a2ba4c5ac6eaa7dcc5555d0696a64a5758bb795dea1a29dc1a6afccb6c61d1ee8c0c0e3b1b1d27272dc9999d47a7ae0a8a982b38ece6061b3cebad68383aac9b1d99090d88a8aca494a2b954fc51112048f3cdacfc8ffffff39b0ddc00000004574524e5300fefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefe19eb755a0000185a4944415478daecd8c792a34a1606e0c6fe244678232840069030c2c823af36efff4a775113319b5974dd91d954ae33f83826e390fcf8f1077fdeb77efcf88337ae6ffe9bffe6bff96ffe9bffe6ff66056fe5e905fd4efe6c9ddfc82b31152b5fd8ef710fe5f3d43ee65fd8cf3d2a7a4207fab9eef92bdfd7673da0c96b93cf2659ceb8fcda98f12e936709fbe2dafbc971d01cb4b9766806c7c47c79ebb14937a9e6d37935e9fe6decff57ebb1b5303396c64ca8d9b71cbc8e69caa66c98ee3de73e09c411351283e42d3ce9e9b0eeeb90eec93bf8c88a130a7c125bd13b78aa0e80c0445053efe05902702d0d90f7743e0085f1edf74dbca088a9e1db787f916502d877f1692665ccb1f0dfc39b852cc994d092b7f07e9ec9f2c2c7587d07cf1745de5a05c17ee7bd8167f38582bc57d094e3b7d49ea682583e42bc7a1c7935efa993f198a583486d9a15c5bf9c77268ecd260c1ae37a1abf3ef9a238861feb104f9bcb766dbf96e722bb198e0604c3d3fee2cccae6e3957c902466335d01c3c34e05b03ea9afe4f9bb14ac3515d81e66e042051f2f4d3e2da4688c2120aaa0824c6a43f6a5b51f388d666c3d0088f8a4b7b245f8427e541986b15bad3dac47384a7d9b142e6dbe86373b322eb5eb76a23ac06accc5b2242d0444ec8b789dccd65b7538197ade074049922549fcbf9a7cff86e7e0aded15541576b506f2ccb2e47ebcaff6de2b78b63f8f47642cda0e06a715a2856449f2115763ba7a099fa4225533034c2636003db6244b763f9a6afb9ae42bc40bb30ecef5ba1b802d16bd25c91d3018fd8fbf278fe60915ba3c22de1c5697663d4024c9fd42922c9d03151dbf7ad7fe32afb842dad539d09c56a07a1a67b92824495a748425e7a7f3ec31396759cc627f75102c78e0f7b1cfe422ce04807b76f2f958b2984526f1586db633d507b01559bd28a4bba08a0353679fca933ecbf273aebbf0d687cbeeb212073680e858e4446d9cdf12f3449ea721588940b70b2b82375a5f2ee5f5da882ae0119643e320d09fc673411f0b3e738ef538bbeb2004dec8697697f2a40e561f47064da37234fbb4e899fb2f06f93d4bf27bc170494f040e1888b3f558dd3bbebf2ae7d73616409ec447751d20c8ee4518b2c031f53bd7f4390ec068b6bd9c8c4335fd1d86541d3d85f7c611089456ff7c3c470bdd39cdfd3600ecc1a8bc55bb8bb107f4827d06ef6cca6a3f08620170aea78ba7e47a611d7928ace300e34abbdaea7c0ff0c11392ff21deb4e9d2d80bb200716318cbad6aea49922ac0ca68d88e178ddbecb49c987d2de0af2f5d7fcd0f36e5a1aab42a8a089ab2aa0e1b15822ea40cc6a571a2ee3a56a5715b61103241d4768fe6c5c6d9efcacd6e321b6278bbee36950721e44dd3bece970da710603c1a607218026e4c3f9abf6e266b7176d85c8c131c63bb9ddf6c108e02c4e974b90561b9308082493501efd2f0c963f99371d8ad27dbe6ba52313e549b720b7bb702c4c35c9bafc1777a1a820294886ef3805e508fe439faf2f35669c61e1f2c85c169aa4daf63bb9a41d48ce9f4e70a44affb94879f2ecefdd124e7f6a1d19bbcb39cce8d930db0e67837d736daf230f900bcc97ebe342e88d2bed7752aeefa73dcd52c6f8a0fe4853c527786d650e0a933b918d3dbeea62dab01c0b25889eb8be7324c4a4148e22e6d73995715d5351fc59324fb7d151d95045caa47a3e954d3ae376d6a38244c5200f0441166c792b83df33019571d99a4a51f163d4f99fff9814102e2fcd4346d77d334638ff697c400f0caea032ce7b749feb5ef9dafcd7b4a31dd76bdfc2f7fb67a12a53a86138073cda44ef827f2c991f6d9cfe497dad47010f9019b58021099bc49a0f77d4e9ec7138582e95d8ca976d33e5b0f5158bb002281a24d42d236d79fc67320742051e38d319fcf8dd211ce6118b7479839cfbbbee02a50e262e13e89a76bdf0cf873047b5fdd0e5bd5ac177d5ed731c7df8580761520d4a9aeebf8e7f051c7532ca24e013cdb064022d2fdaa530e0af863002059b08c64c5fe936a0f8a67c35f21e110c5c2e72be96e7ff681a810389a9811201c8f0c79124fe721477361ea47b10bd5fb0080bce8004ab6741a20005b5b52f7047e2c8e40fb0090df0b1ec07ed778428aa8ae098ef7380058c60494ae3b538fe68797f2e7c6365910a0ceb29ac3b034361f0a0f9814fc3873c1d2b41e0814a8a228f8c7f262596e9a9f5b5651f2087926c90c06ebdb5605baba6edb42ce18f87a9a9f051360dacf51f030de2e77a238bc2e456571af954096322be4ece16725645996a52c00143d6905850d38267f6cf443a31287c3e1a921c5bd25e642eaeb222100c058856459f2a2e838087aaa0b021b8113078fe54b6732fc87553b5b56140ba2001a4c6733cf93283308028aa238e05856fdff37f54375bff6ada8eb17acc88c38717646e6ac1f7a76ce84102e2b61de84640e1897f9d50e994dc0ed189028e4050e8eebba99ef7c8ca7b7bfdad1cd6607d3850a15941d535480cb9a535602d92a303c96943480880690ba557f1cfb8ff17339accc473f76375f745d5754ca3000b8390918164a085cadd088c836028490f567cf5b6f9a7fb4dffab3e65bc0bed35f476d218a0771068026161f708c9524e02dce03005e266212fef4c4b7d956baf947fbad3fe1059a89003f757098c6eedc1dfb19e89237224ec0ed087a2e94001c21c0e319f0acdf99ef437fae66d667787efdc3f6a02840650ed3be7e9b22478ce2ce7b1cfa3d001801c4930ab8b70580c3ed208a27fdc4731fe157712315561373389be6540d439d50e5b55879b4aa250e228606c47cd000f1582d00a73f4d55fece3520e0becd077653c477d69b03627f3c8bb7d32945c097c61c5a5b2db0fa5958fec3ac6770daee296a5027f37de8863161af5fddb37dcdb3e1fa52fc7b1db27f1cabd9f950f9100c42bc28707b60675fb97ea85b07389fc6e374406fd66731594471d394dfe4994692ec354373987b7898e6ed60bedb791c5a00ae069224159420edea5c4f903df733bf7aa649950280705dcbb6f22d9e59ca52bcb60911844b633d4df37936876e1e33550a082cf6830bcca641af4fbe3ade544055016d3f034b116b2d2fb7dfe1d94696ec8bbddc02cc72591e4e637f78e9a3cfcdf4298373132b7701f5f8aaeb61f2b34e04b2f6b848a7ee2532cb4b54cad2ff27cf2f78224952dc4872cc598d2caf152c168193a670c65ba7effdbefb3d5e38c7576b666acad29899e6613f8ee3d99336c25cb6d7b1f0d7fc3cb425fb624bf205ec4592624b086803c0e261eaa77152916810ee7261a9a9b3cf007225e4fcd64f63dfb942448442b69bdd5f57cf06d646b61b495a5e41d9922485c1757b271caa21cfdf8f1450c53e337e6c7fff359c77bdac3cff31e4bade6ba98a9d2d6f4848737fc9336b8ab297b2bcbc58c246b66d390e98a6281551cff5fc95413b678f5ba2d0347ccb027ca58c570adcf774cb5fafba7356f29656d68df5773c67acc3b9b78a2f251d6227db92bca28db2b4665d9beb4305a87daf024072ec8e1a0e63ca33fc1cfdf09c863a1fda942511c5dd4be12fabe7147080c0019c154bb62d3534c77adcf33deaf9a4926d80249da9105fe6dbecdc67ae290284aa9e6ec333d392f4bfc9ec0351f3be946c5b92b78828f466a7d7e3829109b293aea9ddbb1dc7d369dc03489ec3f06af3e4b3419b9297b224c9cba557d8ac7fe8eabcde731190642932bdebda763a1d54a4c7dc1cc676981c127c92bf6e8a429237c5e6ee851cb0d7eb76d40068a083646a6f95983c140567d31cc5c5de9cc21fbb0ff229c709600c0e02a12d4214b86d6bbab09006f2d6195dad3f9c875f11b2e73e1090d47ac62b9fe39daeff4543f35320e23d8e2781e5bec6645e108e63281c8ed5ed36d40958b051748d9cd614e18bb3c587f8c3387519b22449023e2823fa4a5838beb0f9f93beabba6f97ad56d1a951c4bb32b3e38996754f5e07e86cff4ba3bb9aa78105365078f28e5efc7646c3c90dd95c2d9ac73f301b22200295854ba8be3d8561fe1d5d3900faea3a57b6d4e008fe6790120041c38b229361b5edd4f6f3d03090b63dbd80ce0c0397553fa097e71aef3e1093f9b3949ca13ba583100c01b2c1b6057106517339c238a1ca034d23296ee9605b7d5f5238c2f8fb7bfe6dd7ccaf30c0bf1e0a6f01a5bba0b88e6b467cc4b06d7228060c457160a0528eb7855da1b5a495fc3d4beb4fbe503bc39e579a639aa98aae07fc727e56aecb63b5e01b98400f8cd2a0238962b969462af00d1cc3bdd74bf5ea97dc55bec62df0dc32d4992544bc06ee4263a576ae46d8b5518018a76ac34844511b1db75395fdb521c399956e7533d6450bec9b3db4b84a47bbd0e59b54f80ad2caf12bdf369e6be2dcb3200b429d74f2e555074d35c8488f158ff765b9cdfe6bbb798bb277c8b178ad802b4dbe0424c015a92e42dc48c3518ca98d3140b88ddf3363d170282f872417a4ed09b7a8a592546dbe5727967bfd77ccba3a848d580148a57c89264330002d62a43808ad09b797b4a0144b15d089559f9e390bb8403d52ced425afeff56e90b5ea1bc90096001484973dfdab224499b50004045507eacfcb1d6877101b017a991efe93f9cdbd996a33a1205d0c578101218cc0c068c31a30d9e309e8774f5ff7f533fdcc7aece5b595fb05728e2412ba4e3ce873a7fabdb50ebbeda465e765fdf7ee3fd969f0f37fec109d1b64d04c54fb600d7314a194b23097000459be7b9f13983235e69a794f2f08f75fe19246cdb42e0f8c8bcd9bbbfe5c78d1215db9696344e7b602788787429a594d12dc1a8ce1d9c3f86b15763b6134abba54c86fbce8ddc85d5759ec645b226d0f4ef2e5bc142d5b93e8d3a4a599388e09347816521f68cb296c762f55965fafd6a18b59af40a6f33bb4c4535df1bc6be024fcb348ab8c8ebca2efc2bde7d793d654c69182d5b1142fbd008b968b8b122edc4ecf499ae67ea747dcdebfb4402e2d4ee79fdb9caebfd74ed2794ee782e96f92dfbee41fb1bde57f98e51b6f458d7781a845fa908eb11456429c84c817ebabe16c1b43ee6f97ead42934928f9b399ae5e9fcfeb424ad328e2782e8abbe5dff47e9e39c3bc286969735e24f41789f73c20e66205e6038f1e384c9088eeebf4d9afaeef89240238cf013833e83a04662f4dbeb8d83442a5fe98af5e87e73ca1f6d6d3b89631c62104b93512444fe01d3e154302de5480ac5a5ff3e91c5854ce61210a00507890b65f656bda6579836aac9c9ff2fee048b1e545ca328d3a4acb6dc13451b11035b2bf59a9bba4d7e0098f04807eb81f32d7cfaac075939dc22922a7cd408aae642c559ccdf5f9d9fc8c9f4d30f7c5c64a52c698f02859d90a3b8219208504c371a26816ac4b59f621442e040ed309821944e5b12d4c603eea80c579b2181c3ff5fdb4577fc4fbe361bc3b004919657d4c53530382f10cdd177698a80ea700b792d2b2911e652342779d60b1d01a332d1f32b2d3d10f0900e76cd486613cdf57fd47873f51f539116398252b6d4e2600b2e34a85fb4a8833dec745019232dba6b6b6fb6a2c1ff3c0718f7aa83cb6a682c5dae5fa9d35ab4e796e1846bd1a9ffc8ff8cc0d64b32810daed4d93b2b99f55d53807c6e9380bc66c73901076d4b629532c4e5387c902800ef085129b9abbd1955f5d524dafebdc306a63f015cafd845f8c1babe8b68a285bc0e2fd7e9eeff701d0d7fbe9c67150557c18dad4b6ed720760e12ee6c144b280d09480f1b91ef85d81e7f4bace8d7a1d00dc32f901ef38807c5bde38af599a12d4eaf0ba9e36c0e45dd7771fa8869df70fcf7af8f3890ebcceda960052309e37a7fbd901e0d6c79591af2700a4df4797fe0faf2349c224f6229bb12f13004663ac66f09f755e8f3a0e0390d8d4b6296d2d222212e4892f2e39419bac56e76a7a7fde370e70bee6c67e0008913d59b6fe90cf9ef74362e999946cbbb66d7bee1142cfdcf579a65f6b233702b86740a6d4b66dca229e0ffbaf8b041485a021cb3073b3f97135ce905d6be3738618c7bc58c87f5afde67a7c4ff4631d888d573497b46f7989403f5e17f3556e184605f50cc48c52c658b994a0f55f179127dc560201bc1044ccaab30e541fe37dd2398b33b5e8771be6dff091f63abeee87e7b45ec85db18dcc9b22225680607dc0a6368cbc1e9c0cd8b2365d2e97fde566813335c21371c9932644612abb188024c2b91ed7eb390f683117fd59f504eae9b55ad7f5011aa597ae4b907066c169701cff581b46be9f6e6650fa6d134962915ed2a5053d7030d18bc65c8a92b9dd9a21202f5b01433d353248901e0feb377b96ffe5b361a8eef535df0f4423cb92950524b3b85c8a8200f3baaef3fcfaaa7cae6d690f40665f5f6d82835b0d872abc357158149d7d9381a2b3edc4194f2e4285f7ec07c2c693ff951fa6d3696dbc56f9c42c35beb34d0920427f31adcd8861fa3ed52f07711475e597ed25f2b65b0a21a0064135710129e63de1f1301b514afbf4a2342200901d2b1b0865c9fd2b3f7fdd4fabfdf1f439c83711da3fb907d3340bf27cfa0737730207a4bd20e43c4589393e0126e3e67c1cc7971b2c740056a184a12cb4175a481159a80e10f7e5c52a2835ff60f209b2b5f13456ff04fdd403d188175a9e9884920478d2acdafc27218d05a89b19bc82cb8ce97e3a9ca7f5c798bb990f33816997365d12cccea7d36b02ecca2e44a191ef79c923200f5e1cf6ef7a6f0c3a66eea1f26c010b1f62d3a569c30387697d9f202659f59aaa49facbd457b9b1af36fb7c7fd2d5830b8063cc4ee985203855c1790292327651624e0ec3eff8b015c45d4923f7531fffdbce9d35378eaa61002e84e0056c212345bb642339de9278df12dbd97a66feff5f9a0b7757cff4a4cf99f4496e4e992b15a2ea2924405fb1e83608eee2b2deacc954a4f306c5f0e1a637bb221875b69dbb389bdf06fbc35e0f1e44dd598d83f56ed55f3d4759aca214c761ebe61c77ef1b902558afdd6ab75bedf60f7f2bf88197b3593e786d3ba3e01045f37e10586c4e3667eb5d9c4edab420e6b527a353bf3f1e8f57fdfeedf32a765d44cffbed21de755e564fa95aaf470ac7e155efaad5e6f0f7f3b25b313a6d9dfda1f80f7c938a6be48f85f314ec18f0fb7e1ba997f1cb69b76ffceef4a120445c5f11349d71bfd3e9743ae3fded3352e858291559a55493ae553cb259d56a4d5bc35e58426d47c072d27526579387f6ac37e53fe77d67b22460d08760cd4525d214a3e0d47f19dff9c86f0c290a2eae0a60f37278e974faabce4e35768d6635ee77d4f3eddddd08f0d7b11fa7e66a38bc71eab5d6ebed1ac248843dd7eb5d7bcb1bef673c03bd593c48a00902eb4d6614c053b0bb7fbebdabc17aed89c38b5edb299be874d81e562f731f7634dfd46adceff7d576350eee8148c52a8b629e54a1bf7eba57e5e69421591839cb211709ccf2273c592c16b3e9642064bd7dcae9a2b74c80fb40611eccc325a7af137a34ed857fbacd36417098fbce32c7e8f679b419f7fb1d7537ee071b982ace546ce338f564737f98475dbe7bf6c15c180fa05e9952e74d9edf4c67c5649a5cb7174c17a1570d9cee92f82f9d53e7c58adf1eb19c0e5f5bd7ae3e046b7dff1c138857a237f3fb487d597de9abdb2008464eab179659ac9492d71cf168642755bddf91658824475594a79d7bf4dee2bba20a2173b8d448700959c11b1e619fb63b8bd07080535330e866a401300ee940fbd13ad54d93a9281e6de60d68c560adaf54e697b0ba4c25e0abc12b0f17d233289feee155ff767ac17181ff76daec8ddba552beaed3bf2e82e3eb07b7fc5fb60d7d74baf017fec2ff642d9131f67531f08748957d2ff2b7d2ec23f8c40580aa18504a1d438d03630ccf09e03800644569e571c025c21802cf6389e12e358fb428ba00401c40b840d7d0fcfdfc220190cf2807834b21694e99a439cda5710150c298472a20a454329a13ce2be9003905e81100bb26e85e138076f35fe0cd4002c9517000ae008427009187943a009c0400bc0a0885002a8f734fb8004201248f5d803c72245c000961bff0f045512017155d0a11ca2511893c924400090580c201006f22c4c00c8a848270705a9cf98a08485a70760c4d17b232de2ff0924a91179430097974060e068ee18043806fa75fbc84b1ae309c162004000dcfb5cf932ee19cf36532480084f4fd3c051f0854d401e052b8341490467e85a5f180909fdf3d989184e4ec3b1f0e0c08112e40c32ef25fe01386631724390a219c0a20a4020887778e154341a9e004709384c1218ee31853006e0514212881535400889350d37d3f7feeec8cb9611832f6ad77b3efdddd75cfd7dff22125fe56e2db00e0b2cba0fb217c893202d27f845bf579d632d59fc697599a5a6b5583e887c3de998e6c0900baf17d94fa53781da7510d588de6afb54f01e5fbe71c5fc3beeb24fabfe353a425ea184891c68d8deb1411740aa0b4b6d6d636295096a8ebd442d525d2a8fe385e2b3f8efd38d6a546da00d65776938d54d6d4da42dbd4575996354a436b3f8debb851cd3afab08db23acb1a3fcbb21a7ed368a0f6b378136f62b5f1e15bab91d6becab2ba04cac62aa532657d5b7e4acbffdada6c1443bfb53bc3cfa2cfeff7aab619ec5b6b144d937e3a5f2a6dfdb7dbb88efe7f47bd0b7fe12ffc85bff017fec2bf3ffdf127b30e2064cc2a5fd00000000049454e44ae426082', 'hex'),
    size: 458379
  },
  pdfAttemptResponseDto: {
    data: {
      pdf_id: '5fb21ac4ec2fce19946233c8',
      pdf_url: 'www.mockurl.com'
    }
  },
  pdfAttemptResponse: {
    data: {
      pdf_id: '5fbbccd36a0c1653010b74b8',
      pdf_url: 'https://mockUrl.net/pdfs/5fbba944de93a4353e4a865b?st=2020-11-23T12%3A16%3A41Z&se=2020-11-23T13%3A16%3A41Z&sp=r&sv=2018-03-28&sr=b&sig=GSATe9MlYw4VBi9fQoRVbTz%2F7xjO1B02RFyg7UMG2fY%3D'
    }
  },
  referer: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUyMTk5NjEwNA==',
  legacyUiVersion: '20201201.1',
  newUiVersion: '20210204.3',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
  orderRequestDto: {
    text: 'da w', cardID: 'custom_photo', tosAgreed: undefined, locale: undefined
  },
  pdfRequestDto: { store_number: '2286', employee_id: '12345' },
  existingPdfRequestDto: { store_number: '12345', ea_order_number: '12345', employee_id: '12345' },
  printAttemptId: '5fbb0b11a33957888e5a0d33',
  existingPrintibleId: '5fbbccd36a0c1653010b74b8',
  definitionId: 'Thanksgiving_A',
  orderResponseDto: {
    data: {
      previewUri: 'undefined/assets/i/custom_photo_thumb_front.png',
      mediumPreviewUri: 'undefined/assets/i/custom_photo_thumb_front.png',
      printibleID: '5fb21ac4ec2fce19946233c8'
    }
  },
  tokenUri: 'https://test-blob.core.windows.net/pdfs/5fbbccd36a0c1653010b74b8?st=2020-11-23T17%3A07%3A59Z&se=2020-11-23T18%3A07%3A59Z&sp=r&sv=2018-03-28&sr=b&sig=zQLj9Founqx2HRSc6NgmefzGa5bCz2Tj5G2i6%2BHuCPw%3D',
  fileBuffer: Buffer.from('<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 06 72 00 00 09 f6 08 03 00 00 00 40 0f ac 11 00 00 00 19 74 45 58 74 53 6f 66 74 77 61 72 65 00 ... 43471 more bytes>'),
  printibleId: '5fbac9fdf94b643a66729ad0',
  tokenResponse: {
    token: 'st=2020-11-23T02%3A08%3A49Z&se=2020-11-23T03%3A08%3A49Z&sp=r&sv=2018-03-28&sr=b&sig=Ml%2FkwmUKJ8LlLCej3syrZrV%2FESPx6Gog4%2FOrLgME1Sk%3D',
    uri: 'https://mockurl.net/pdfs/5fbb188eb014429bd28c215f?st=2020-11-23T02%3A08%3A49Z&se=2020-11-23T03%3A08%3A49Z&sp=r&sv=2018-03-28&sr=b&sig=Ml%2FkwmUKJ8LlLCej3syrZrV%2FESPx6Gog4%2FOrLgME1Sk%3D'
  },
  urlToken: 'https://mockUrl.net/pdfs/5fbba944de93a4353e4a865b?st=2020-11-23T12%3A16%3A41Z&se=2020-11-23T13%3A16%3A41Z&sp=r&sv=2018-03-28&sr=b&sig=GSATe9MlYw4VBi9fQoRVbTz%2F7xjO1B02RFyg7UMG2fY%3D',
  orderUpdateRequest: {
    ea_order_number: '12345',
    ea_store_number: '12345',
    fulfillment_date: new Date('2020-11-16T10:57:06.787Z')
  },
  cardDefinition: {
    id: 'custom_photo',
    name: 'custom_photo',
    type: 'portrait',
    attributes: ['photo'],
    category: ['custom_photo'],
    tags: ['custom'],
    culture: ['en-US', 'en-CA', 'fr-CA'],
    font: {
      family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
    },
    textarea_offset: {
      top: 0,
      bottom: 0
    }
  },
  updateWithResponse: {
    _id: ObjectId('5fbacb28f693663b979f9f25'),
    ea_order_number: '12345',
    create_date: new Date('2020-11-22T20:33:44.068Z'),
    update_date: new Date('2020-11-22T20:33:54.902Z'),
    last_print_attempt_date: null,
    last_print_success_date: null,
    print_attempts_count: 0,
    print_successes_count: 0,
    printible_type: 'card',
    print_attempts: [],
    print_successes: [],
    origin_api_version: 'api version',
    fulfillment_date: null,
    ea_store_number: '12345',
    definition_id: 'Thanksgiving_A',
    customer_text: 'bowie',
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNjA3NzIxODI0NA==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    app_version: process.env.APP_VERSION,
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20201201.1',
    brand: Brand.Dcards
  },
  sasToken: {
    token: 'st=2020-11-23T23%3A06%3A48Z&se=2020-11-24T00%3A06%3A48Z&sp=r&sv=2018-03-28&sr=b&sig=5QVf1rEpzE7WflpAGUwwuAj%2FrkSZEI1UepjeJSgGYd4%3D',
    uri: 'https://test-blob.core.windows.net/pdfs/5fbac9fdf94b643a66729ad0?st=2020-11-23T23%3A06%3A48Z&se=2020-11-24T00%3A06%3A48Z&sp=r&sv=2018-03-28&sr=b&sig=5QVf1rEpzE7WflpAGUwwuAj%2FrkSZEI1UepjeJSgGYd4%3D'
  },
  pdfData: {
    id: '5fbc4f2799cfb338d59f1c98',
    text: 'testing 1, 2',
    fontFamily: 'Roboto Slab',
    fontSize: '14',
    fontColor: '#000',
    cardId: 'Thanksgiving_A',
    layout: 'portrait',
    orderNumber: '',
    create_date: new Date('2020-11-24T00:09:11.121Z'),
    attributes: [],
    textareaTop: 0,
    textareaHeight: 0
  },
  orderUpdateResponseDto: {
    data: {
      _id: ObjectId('5fbacb28f693663b979f9f25'),
      ea_order_number: '12345',
      create_date: new Date('2020-11-22T20:33:44.068Z'),
      update_date: new Date('2020-11-22T20:33:54.902Z'),
      last_print_attempt_date: null,
      last_print_success_date: null,
      print_attempts_count: 0,
      print_successes_count: 0,
      printible_type: 'card',
      print_attempts: [],
      print_successes: [],
      origin_api_version: 'api version',
      fulfillment_date: null,
      ea_store_number: '12345',
      definition_id: 'Thanksgiving_A',
      app_version: process.env.APP_VERSION,
      customer_text: 'bowie',
      referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNjA3NzIxODI0NA==',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      tos_agreed: undefined,
      tos_update_date: null,
      ui_version: '20201201.1',
      brand: Brand.Dcards
    },
    message: 'Order Successfully Updated'
  },
  orderToSave: {
    _id: ObjectId('5fb21ac4ec2fce19946233c8'),
    create_date: new Date('2020-11-16T10:57:06.787Z'),
    customer_text: 'asd',
    definition_id: 'VeteransDay_A',
    fulfillment_date: new Date('2020-11-16T10:57:06.787Z'),
    ea_order_number: '12345',
    ea_store_number: '12345',
    last_print_attempt_date: null,
    last_print_success_date: null,
    origin_api_version: 'development',
    print_attempts: [],
    print_attempts_count: 0,
    print_successes: [],
    print_successes_count: 0,
    app_version: process.env.APP_VERSION,
    printible_type: 'card',
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUxMTU4ODM0NQ==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    update_date: new Date('2015-06-14T22:12:05.275Z'),
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20210101.1',
    brand: Brand.Dcards
  },
  printAttemptDelta: {
    ea_order_number: undefined,
    last_print_attempt_date: new Date('2015-06-14T22:12:05.275Z'),
    print_attempts: [{
      client_ip: '', employee_id: '12345', store_number: '2286', time: new Date('2015-06-14T22:12:05.275Z')
    }],
    print_attempts_count: 1
  },
  printSuccessDelta: {
    ea_order_number: undefined,
    last_print_success_date: new Date('2015-06-14T22:12:05.275Z'),
    print_successes: [{
      client_ip: '', employee_id: '12345', store_number: '2286', time: new Date('2015-06-14T22:12:05.275Z')
    }],
    print_successes_count: 1
  },
  preparePdfData: {
    attributes: ['photo'],
    cardId: 'custom_photo',
    create_date: new Date('2020-11-16T10:57:06.787Z'),
    fontColor: '#000',
    fontFamily: 'Roboto Slab',
    fontSize: '14',
    id: '5fb21ac4ec2fce19946233c8',
    layout: 'portrait',
    orderNumber: '',
    text: 'asd',
    textareaHeight: 2406,
    textareaTop: 72,
    uiVersion: '20210101.1',
    brand: Brand.Dcards
  },
  updatedOrder:
  {
    _id: ObjectId('5fb21ac4ec2fce19946233c8'),
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUxMTU4ODM0NQ==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    customer_text: 'asd',
    definition_id: 'VeteransDay_A',
    ea_order_number: '1234',
    create_date: new Date('2020-11-16T10:57:06.787Z'),
    update_date: new Date('2020-11-16T10:57:06.787Z'),
    last_print_attempt_date: null,
    last_print_success_date: null,
    print_attempts_count: 0,
    print_successes_count: 0,
    printible_type: 'card',
    print_attempts: [],
    print_successes: [],
    origin_api_version: 'development',
    fulfillment_date: new Date('2020-11-16T10:57:06.787Z'),
    ea_store_number: '1234',
    app_version: process.env.APP_VERSION,
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20201201.1',
    brand: Brand.Dcards
  },
  orderRequest: {
    cardID: '12345',
    text: 'example text',
    tosAgreed: true
  },
  newOrderResponse: {
    _id: ObjectId('5fb21ac4ec2fce19946233c8'),
    create_date: new Date('2020-11-16T10:57:06.787Z'),
    customer_text: 'asd',
    definition_id: 'VeteransDay_A',
    fulfillment_date: null,
    ea_order_number: null,
    ea_store_number: null,
    last_print_attempt_date: null,
    last_print_success_date: null,
    origin_api_version: 'development',
    print_attempts: [],
    print_attempts_count: 0,
    print_successes: [],
    print_successes_count: 0,
    app_version: process.env.APP_VERSION,
    printible_type: 'card',
    referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUxMTU4ODM0NQ==',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    update_date: new Date('2020-11-16T10:57:06.787Z'),
    tos_agreed: undefined,
    tos_update_date: null,
    ui_version: '20210101.1',
    brand: Brand.Dcards
  },
  PdfSuccessResponseDto: {
    data: {
      updatedOrder: {
        _id: ObjectId('5fb21ac4ec2fce19946233c8'),
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        referrer_url: 'http://localhost:3000/?hostUrl=http://localhost:3000&locale=en-US&token=MTYwNTUxMTU4ODM0NQ==',
        customer_text: 'asd',
        definition_id: 'VeteransDay_A',
        ea_order_number: '1234',
        create_date: new Date('2020-11-16T10:57:06.787Z'),
        update_date: new Date('2020-11-16T10:57:06.787Z'),
        last_print_attempt_date: null,
        last_print_success_date: null,
        print_attempts_count: 0,
        print_successes_count: 0,
        printible_type: 'card',
        print_attempts: [],
        print_successes: [],
        origin_api_version: 'development',
        fulfillment_date: new Date('2020-11-16T10:57:06.787Z'),
        ea_store_number: '1234',
        app_version: process.env.APP_VERSION,
        tos_agreed: undefined,
        tos_update_date: null,
        ui_version: '20201201.1',
        brand: Brand.Dcards
      }
    }
  },
  headersDto: {
    locale: 'en-US' as Locale,
    invalidate_cache: true,
    hidephotocards: 'false',
    referer: 'edible.com'
  },
  categoryResponseDto:
  {
    data: {
      categories: [
        {
          id: 'a_hb_general',
          name: 'Happy Birthday (General)',
          culture_names: [
            {
              'en-US': 'Happy Birthday (General)'
            },
            {
              'en-CA': 'Happy Birthday (General)'
            },
            {
              'fr-CA': 'Joyeux anniversaire (Générale)'
            }
          ],
          sequence: 100,
          preview_cards: [
            'birthday_his_general',
            'birthday_hers_B'
          ],
          cards: [
            {
              id: 'birthday_general_A',
              name: 'Birthday_general_A (purplish, bubbly)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids',
                'c_hb_her',
                'd_hb_him'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_general_B',
              name: 'Birthday_general_B (blue gift)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids',
                'c_hb_her',
                'd_hb_him'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_hers_B',
              name: 'Birthday_HersB-General (make a wish candles)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_his_general',
              name: 'Birthday_him-general (not geting old awesome)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_hers_A',
              name: 'Bithday Hers_A (born to be fabulous)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids'
              ],
              tags: [],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            }
          ]
        }
      ]
    }
  },
  categoryResponseDto1:
  {
    data: {
      categories: [
        {
          id: 'custom_photo',
          name: 'Custom Photo (General)',
          culture_names: [
            {
              'en-US': 'Custom Photo (General)'
            },
            {
              'en-CA': 'Custom Photo (General)'
            },
            {
              'fr-CA': 'Photo personnalisée (Générale)'
            }
          ],
          sequence: 40,
          cards: [
            {
              id: 'custom_photo',
              name: 'custom_photo',
              type: 'portrait',
              attributes: [
                'photo'
              ],
              category: [
                'custom_photo'
              ],
              tags: [
                'custom'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_general_custom_A',
              name: 'Birthday_general_custom_A (purplish, bubbly)',
              type: 'portrait',
              attributes: [
                'overlay'
              ],
              category: [
                'custom_photo'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            }
          ]
        },
        {
          id: 'a_hb_general',
          name: 'Happy Birthday (General)',
          culture_names: [
            {
              'en-US': 'Happy Birthday (General)'
            },
            {
              'en-CA': 'Happy Birthday (General)'
            },
            {
              'fr-CA': 'Joyeux anniversaire (Générale)'
            }
          ],
          sequence: 100,
          cards: [
            {
              id: 'birthday_general_A',
              name: 'Birthday_general_A (purplish, bubbly)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids',
                'c_hb_her',
                'd_hb_him'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_general_B',
              name: 'Birthday_general_B (blue gift)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids',
                'c_hb_her',
                'd_hb_him'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_hers_B',
              name: 'Birthday_HersB-General (make a wish candles)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_his_general',
              name: 'Birthday_him-general (not geting old awesome)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general'
              ],
              tags: [
                'bday'
              ],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            },
            {
              id: 'birthday_hers_A',
              name: 'Bithday Hers_A (born to be fabulous)',
              type: 'portrait',
              attributes: [],
              category: [
                'a_hb_general',
                'b_hb_kids'
              ],
              tags: [],
              culture: [
                'en-US',
                'en-CA',
                'fr-CA'
              ],
              font: {
                family: 'Roboto Slab',
                size: '14',
                weight: '500',
                color: '#000'
              }
            }
          ]
        }
      ],
      customImagesUrl: 'www.mockurl.com/custom-images'
    }
  },
  allCategories:
    [
      {
        id: 't_thanksgiving',
        name: 'Thanksgiving',
        culture_names: [{
          'en-US': 'Thanksgiving'
        },
        {
          'en-CA': 'Thanksgiving'
        },
        {
          'fr-CA': 'action de grâces'
        }
        ],
        start_date: '2020-11-16T10:57:06.787Z',
        end_date: '2020-11-26T10:57:06.787Z',
        sequence: 10
      },
      {
        id: 'custom_photo',
        name: 'Custom Photo (General)',
        culture_names: [
          {
            'en-US': 'Custom Photo (General)'
          },
          {
            'en-CA': 'Custom Photo (General)'
          },
          {
            'fr-CA': 'Photo personnalisée (Générale)'
          }
        ],
        sequence: 40
      },
      {
        id: 'a_hb_general',
        name: 'Happy Birthday (General)',
        preview_cards: [
          'birthday_his_general',
          'birthday_hers_B'
        ],
        culture_names: [
          {
            'en-US': 'Happy Birthday (General)'
          },
          {
            'en-CA': 'Happy Birthday (General)'
          },
          {
            'fr-CA': 'Joyeux anniversaire (Générale)'
          }
        ],
        sequence: 100
      }
    ],
  allCards: [
    {
      id: 'custom_photo',
      name: 'custom_photo',
      type: 'portrait',
      attributes: ['photo'],
      category: ['custom_photo'],
      tags: ['custom'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_general_A',
      name: 'Birthday_general_A (purplish, bubbly)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids', 'c_hb_her', 'd_hb_him'],
      tags: ['bday'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_general_B',
      name: 'Birthday_general_B (blue gift)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids', 'c_hb_her', 'd_hb_him'],
      tags: ['bday'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_general_custom_A',
      name: 'Birthday_general_custom_A (purplish, bubbly)',
      type: 'portrait',
      attributes: ['overlay'],
      category: ['custom_photo'],
      tags: ['bday'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_hers_B',
      name: 'Birthday_HersB-General (make a wish candles)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids'],
      tags: ['bday'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'FR_birthday_hers_B',
      name: 'FR_Birthday_HersB-General (make a wish candles)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids'],
      tags: ['bday'],
      culture: ['en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_his_general',
      name: 'Birthday_him-general (not geting old awesome)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general'],
      tags: ['bday'],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'birthday_hers_A',
      name: 'Bithday Hers_A (born to be fabulous)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids'],
      tags: [],
      culture: ['en-US', 'en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'FR_birthday_hers_A',
      name: 'FR_Bithday Hers_A (born to be fabulous)',
      type: 'portrait',
      attributes: [],
      category: ['a_hb_general', 'b_hb_kids'],
      tags: [],
      culture: ['en-CA', 'fr-CA'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_A',
      name: 'Thanksgiving_A',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_B',
      name: 'Thanksgiving_B',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_C',
      name: 'Thanksgiving_C',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_D',
      name: 'Thanksgiving_D',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_E',
      name: 'Thanksgiving_E',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    },
    {
      id: 'Thanksgiving_F',
      name: 'Thanksgiving_F',
      type: 'portrait',
      attributes: [],
      category: ['t_thanksgiving'],
      tags: [],
      culture: ['en-US'],
      font: {
        family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
      }
    }
  ],
  cardDefinitionResult:
  {
    id: 'Thanksgiving_A',
    name: 'Thanksgiving_A',
    type: 'portrait',
    attributes: [],
    category: ['t_thanksgiving'],
    tags: [],
    culture: ['en-US'],
    font: {
      family: 'Roboto Slab', size: '14', weight: '500', color: '#000'
    }

  },
  translationsResponceDto: {
    data: {
      agreement: {
        title: 'Printible by Edible Arrangements®',
        subTitle: 'Acknowledgement and Release',
        updatedAtTitle: 'Last Updated December 2, 2020',
        updatedAtDate: {
          day: 2,
          month: 12,
          year: 2020
        },
        tos: 'Agreement contents'
      }
    }
  },
  initialDataResponceDto: {
    data: {
      tosAgreement: {
        agreement: {
          title: 'Printible by Edible Arrangements®',
          subTitle: 'Acknowledgement and Release',
          updatedAtTitle: 'Last Updated December 2, 2020',
          updatedAtDate: {
            day: 2,
            month: 12,
            year: 2020
          },
          tos: 'Agreement contents'
        }
      },
      categoriesData: [{
        id: 'a_hb_general',
        name: 'Happy Birthday (General)',
        culture_names: [
          {
            'en-US': 'Happy Birthday (General)'
          },
          {
            'en-CA': 'Happy Birthday (General)'
          },
          {
            'fr-CA': 'Joyeux anniversaire (Générale)'
          }
        ],
        sequence: 100,
        cards: [
          {
            id: 'birthday_general_A',
            name: 'Birthday_general_A (purplish, bubbly)',
            type: 'portrait',
            attributes: [],
            category: [
              'a_hb_general',
              'b_hb_kids',
              'c_hb_her',
              'd_hb_him'
            ],
            tags: [
              'bday'
            ],
            culture: [
              'en-US',
              'en-CA',
              'fr-CA'
            ],
            font: {
              family: 'Roboto Slab',
              size: '14',
              weight: '500',
              color: '#000'
            }
          },
          {
            id: 'birthday_general_B',
            name: 'Birthday_general_B (blue gift)',
            type: 'portrait',
            attributes: [],
            category: [
              'a_hb_general',
              'b_hb_kids',
              'c_hb_her',
              'd_hb_him'
            ],
            tags: [
              'bday'
            ],
            culture: [
              'en-US',
              'en-CA',
              'fr-CA'
            ],
            font: {
              family: 'Roboto Slab',
              size: '14',
              weight: '500',
              color: '#000'
            }
          },
          {
            id: 'birthday_hers_B',
            name: 'Birthday_HersB-General (make a wish candles)',
            type: 'portrait',
            attributes: [],
            category: [
              'a_hb_general',
              'b_hb_kids'
            ],
            tags: [
              'bday'
            ],
            culture: [
              'en-US',
              'en-CA',
              'fr-CA'
            ],
            font: {
              family: 'Roboto Slab',
              size: '14',
              weight: '500',
              color: '#000'
            }
          },
          {
            id: 'birthday_his_general',
            name: 'Birthday_him-general (not geting old awesome)',
            type: 'portrait',
            attributes: [],
            category: [
              'a_hb_general'
            ],
            tags: [
              'bday'
            ],
            culture: [
              'en-US',
              'en-CA',
              'fr-CA'
            ],
            font: {
              family: 'Roboto Slab',
              size: '14',
              weight: '500',
              color: '#000'
            }
          },
          {
            id: 'birthday_hers_A',
            name: 'Bithday Hers_A (born to be fabulous)',
            type: 'portrait',
            attributes: [],
            category: [
              'a_hb_general',
              'b_hb_kids'
            ],
            tags: [],
            culture: [
              'en-US',
              'en-CA',
              'fr-CA'
            ],
            font: {
              family: 'Roboto Slab',
              size: '14',
              weight: '500',
              color: '#000'
            }
          }
        ]
      }]
    }
  }
};
