/**
 * In this file we import the font awesome icons individually, and map them to a 
 * key of an object, which serves as a mapper so that we can use icons dynamically.
 * This is needed so that the icons reference can be saved in the backend as simply a
 * string, and then matched with its respective icon in the front end.
 */
import { faUserAstronaut, faRocket, faEarthEurope, faPoo, faCode, faFire, faShieldCat, faShieldDog, faHeart, faWeightScale, faCannabis, faCircleRadiation, faBookOpen, faPenNib, faPencil, faLandmark, faPhoneVolume, faGlasses, faMoneyBillWave, faFeather, faDragon, faKiwiBird, faOtter, faHorseHead, faDumbbell, faBicycle, faPersonRunning, faFutbol, faCommentsDollar, faBrain, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface StringIconMapperType {
    [key: string]: IconDefinition;
}

export const stringIconMapper: StringIconMapperType = {
    userAstronaut: faUserAstronaut,
    rocket: faRocket,
    earthEurope: faEarthEurope,
    poo: faPoo,
    code: faCode,
    fire: faFire,
    shieldCat: faShieldCat,
    shieldDog: faShieldDog,
    weightScale: faWeightScale,
    heart: faHeart,
    cannabis: faCannabis,
    circleRadiation: faCircleRadiation,
    bookOpen: faBookOpen,
    penNib: faPenNib,
    pencil: faPencil,
    landmark: faLandmark,
    phoneVolume: faPhoneVolume,
    glasses: faGlasses,
    moneyBillWave: faMoneyBillWave,
    feather: faFeather,
    dragon: faDragon,
    kiwiBird: faKiwiBird,
    otter: faOtter,
    horseHead: faHorseHead,
    dumbbell: faDumbbell,
    bicycle: faBicycle,
    personRunning: faPersonRunning,
    futbol: faFutbol,
    commentsDollar: faCommentsDollar,
    brain: faBrain,
}











// iterate options:
// const iconValues = Object.values(myIcons);

// iconValues.forEach(icon => {
//   // Do something with the icon
//   console.log(icon);
// });

// or
// for (const key in myIcons) {
//     if (myIcons.hasOwnProperty(key)) {
//       const icon = myIcons[key];
//       // Do something with the icon
//       console.log(key, icon);
//     }
//   }