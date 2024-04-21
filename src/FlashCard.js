// FlashCard.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Card = styled.div`
  width: 200px;
  height: 80px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  border-radius: 8px;
  border: 2px solid #${Math.floor(Math.random() * 16777215).toString(16)};
  cursor: pointer;

`;

const SpeakerIcon = styled(FontAwesomeIcon)`
width: 39px;
margin: 5px;
padding: 10px;
color: #4caf50;
background-color: white;
border: 1px solid #90EE90;
border-radius: 5px;
font-size: 12px;
cursor: pointer;
&:hover {
  background-color: #ddd;
}
`;

const VoiceDropdown = styled.select`
  margin-bottom: 10px;
  padding: 5px;
  font-size: 16px;
`;

const CloseButton = styled.button`
    top: '20px',
    border: 'none',
    cursor: 'pointer',
    color: 'red',
`;

const GenerateButton = styled.button`
width: 150px;
margin: 5px;
padding: 10px;
background-color: #4caf50;
color: #fff;
border: none;
border-radius: 5px;
font-size: 12px;
cursor: hand;
&:hover {
  background-color: #ddd;
}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const InputWords = styled.textarea`
  width: 60%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 16px;
  resize: vertical;
  font-size: 22px;
  `



const FlashCardApp = () => {
  const [cards, setCards] = useState([]);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalWord, setModalWord] = useState('');
  const [inputWord, setInputWord] = useState("Ant,Bug,Cat,Dog,Egg,Fox,Ice,Jam");

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const allVoices = synth.getVoices();
      const englishVoices = allVoices.filter((voice) => voice.lang.startsWith('en'));
      setVoices(englishVoices);
      setSelectedVoice(englishVoices[0]);
    };

    populateVoices();
    generateCards();

    if (synth.addEventListener) {
      synth.addEventListener('voiceschanged', populateVoices);
    } else if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }

    return () => {
      if (synth.removeEventListener) {
        synth.removeEventListener('voiceschanged', populateVoices);
      } else if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  const speakWord = (word) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = selectedVoice;
    utterance.rate = 0.75;
    synth.speak(utterance);
  };



  const openModal = (word) => {
    setModalWord(word);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleVoiceChange = (event) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    setSelectedVoice(voice);
    generateCards();
  };

  const handleInputChange = (event) => {
    setInputWord(event.target.value);
  };

  const generateCards = () => {
    

      const uiCards = inputWord
      .split(',')
      .map((word) => word.trim())
        .filter((word) => word !== '').map((card, index) => (
        
          <div key={index}>
            <Card style={{ border: `2px solid ${'#' + Math.floor(Math.random() * 16777215).toString(16)}` }}>
            <div  style={{ color: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}` }}>{card}</div>
            <div>
              <SpeakerIcon icon={faVolumeUp} onClick={(event) => {
                event.stopPropagation(); 
                speakWord(card);
              }} />
              <SpeakerIcon icon={faImage} onClick={(event) => {
                event.stopPropagation(); 
                openModal(card);
              }} />
            </div>
          </Card>
        </div>
      ))
      setCards(uiCards);
      
  };


  return (
    <div>
      Voice: 
      <VoiceDropdown value={selectedVoice?.name} onChange={handleVoiceChange}>
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </VoiceDropdown>
      <div>
      Please provide with the list of words, separated by commas.(,):
        <div></div>
        <InputWords value={inputWord} onChange={handleInputChange} />
        <div/>
        <GenerateButton onClick={generateCards}>Generate Cards</GenerateButton>
      </div>
      <Container>
      {cards}
      {showModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
            <h2>Bing Image Search for "{modalWord}"</h2>
            <iframe
              title="Bing Image Search"
              src={`https://www.bing.com/images/search?q=${encodeURIComponent(modalWord)}`}
              width="800"
              height="600"
            ></iframe>
          </ModalContent>
        </Modal>
      )}
  </Container>
      </div>
  );
};

export default FlashCardApp;