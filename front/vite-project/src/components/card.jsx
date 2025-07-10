import React, { useContext } from 'react';
import { UserDataContext } from '../context/userContext.jsx';
import PropTypes from 'prop-types';

const Card = ({ image }) => {
  const {
    setFrontendImage,
    setBackendImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const handleSelectImage = () => {
    setSelectedImage(image);
    setFrontendImage('');
    setBackendImage('');
  };

  return (
    <div
      className="w-[80px] h-[80px] lg:w-[150px] lg:h-[250px] bg-[#030303] border-2 border-blue-500 rounded-2xl overflow-hidden hover:border-white cursor-pointer"
      onClick={handleSelectImage}
    >
      <img src={image} alt="User avatar" className="w-full h-full object-cover" />
    </div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
};

export default Card;

