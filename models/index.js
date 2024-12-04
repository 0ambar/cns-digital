import User from './User.js';
import Staff from './Staff.js';
import Cartilla from './Cartilla.js';
import EntidadFederativa from './EntidadFederativa.js';

// Relacion para la cartilla de un usuario
User.belongsTo(Cartilla, {foreignKey: 'cartillaId'});

// Relacion para la entidad federativa de un usuario
User.belongsTo(EntidadFederativa, {foreignKey: 'entidadId'});

export {
    User,
    Staff,
    Cartilla,
    EntidadFederativa
}