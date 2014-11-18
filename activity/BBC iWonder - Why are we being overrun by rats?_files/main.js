define(['./sdk/interactive-diagram'], function(interactiveDiagram) {
  var config;

  //Array used to populate and position labels..
  var labels = [
  

    {text:"Ears",	orientation:"left",  pos:
	[{yPos: "30%", xPos:"53%"},    
	{yPos: "30%", xPos:"53%"},        
	{yPos: "30%", xPos:"53%"}],     
	contentID:"ears"},


	{text:"Brain",	orientation:"top",  pos:
	[{yPos: "30%", xPos:"59%"},    
	{yPos: "30%", xPos:"59%"},      
	{yPos: "30%", xPos:"59%"}],     
	contentID:"brain"},


	{text:"Nose",	orientation:"right",  pos:
	[{yPos: "38%", xPos:"34%"},    
	{yPos: "38%", xPos:"34%"},      
	{yPos: "38%", xPos:"34%"}],     
	contentID:"nose"},


	{text:"Whiskers",	orientation:"right",  pos:
	[{yPos: "54%", xPos:"45%"},    
	{yPos: "54%", xPos:"45%"},      
	{yPos: "54%", xPos:"45%"}],     
	contentID:"whiskers"},


    {text:"Legs",	orientation:"bottom",  pos:
	[{yPos: "28%", xPos:"44%"},    
	{yPos: "28%", xPos:"44%"},      
	{yPos: "28%", xPos:"44%"}],     
	contentID:"legs"},


    {text:"Tail",	orientation:"bottom",  pos:
	[{yPos: "33%", xPos:"15%"}, 
	{yPos: "35%", xPos:"15%"},     
	{yPos: "35%", xPos:"15%"}],  
	contentID:"tail"},


    {text:"Reproduction",	orientation:"left",  pos:
	[{yPos: "55%", xPos:"40%"},    
	{yPos: "55%", xPos:"40%"},        
	{yPos: "55%", xPos:"40%"}],     
	contentID:"repro"},
	
	
  ];

  var labelDescriptions = [
    {
      id: "ears",
      content: [
'<div><img src="%configBaseUrl%/images/hearing_m.jpg" alt="Ears"><p>Rats can hear ultrasound, detecting noises up to 80 or 90,000Hz – that’s four times greater than our own hearing and twice as high as a dog’s. Rats also produce ultrasound and communicate with each other in squeaks, clicks, and whines that we cannot hear.</p></div>',

'<div><img src="%configBaseUrl%/images/hearing_t.jpg" alt="Ears"><p>Rats can hear ultrasound, detecting noises up to 80 or 90,000Hz – that’s four times greater than our own hearing and twice as high as a dog’s. Rats also produce ultrasound and communicate with each other in squeaks, clicks, and whines that we cannot hear.</p></div>',

'<div><img src="%configBaseUrl%/images/hearing_d.jpg" alt="Ears"><p>Rats can hear ultrasound, detecting noises up to 80 or 90,000Hz – that’s four times greater than our own hearing and twice as high as a dog’s. Rats also produce ultrasound and communicate with each other in squeaks, clicks, and whines that we cannot hear.</p></div>']
    },

    {
      id: "brain",
      content: [
'<div><img src="%configBaseUrl%/images/intel_m.jpg" alt="Brain"><p>Rats are able to remember their way around complex sewer and burrow networks. They are social animals and learn from one another, capable of disregarding personal experiences in order to copy the behaviour of their peers.</p></div>',

'<div><img src="%configBaseUrl%/images/intel_t.jpg" alt="Brain"><p>Rats are able to remember their way around complex sewer and burrow networks. They are social animals and learn from one another, capable of disregarding personal experiences in order to copy the behaviour of their peers.</p></div>',

'<div><img src="%configBaseUrl%/images/intel_d.jpg" alt="Brain"><p>Rats are able to remember their way around complex sewer and burrow networks. They are social animals and learn from one another, capable of disregarding personal experiences in order to copy the behaviour of their peers.</p></div>']
    },

    {
      id: "nose",
      content: [
'<div><img src="%configBaseUrl%/images/smell_m.jpg" alt="Nose"><p>The brown rat’s best sensory channel is scent, using it to find food and distinguish between individuals of a group. Rats learn what food they might like from smelling the breath of other rats and their sense of smell also registers the presence of chemicals that indicate a change in the emotional state of other rats.</p></div>',

'<div><img src="%configBaseUrl%/images/smell_t.jpg" alt="Nose"><p>The brown rat’s best sensory channel is scent, using it to find food and distinguish between individuals of a group. Rats learn what food they might like from smelling the breath of other rats and their sense of smell also registers the presence of chemicals that indicate a change in the emotional state of other rats.</p></div>',

'<div><img src="%configBaseUrl%/images/smell_d.jpg" alt="Nose"><p>The brown rat’s best sensory channel is scent, using it to find food and distinguish between individuals of a group. Rats learn what food they might like from smelling the breath of other rats and their sense of smell also registers the presence of chemicals that indicate a change in the emotional state of other rats.</p></div>',]
    },

    {
      id: "whiskers",
      content: [
'<div><img src="%configBaseUrl%/images/whiskers_m.jpg" alt="Whiskers"><p>Thought to be as sensitive as a human’s fingertips, rats rely heavily on their whiskers to feel the world around them. Whiskers help the rat navigate their world, orient themselves and balance, using them to find and discriminate food, court a mate and determine if they can fit through openings.</p></div>',

'<div><img src="%configBaseUrl%/images/whiskers_t.jpg" alt="Whiskers"><p>Thought to be as sensitive as a human’s fingertips, rats rely heavily on their whiskers to feel the world around them. Whiskers help the rat navigate their world, orient themselves and balance, using them to find and discriminate food, court a mate and determine if they can fit through openings.</p></div>',

'<div><img src="%configBaseUrl%/images/whiskers_d.jpg" alt="Whiskers"><p>Thought to be as sensitive as a human’s fingertips, rats rely heavily on their whiskers to feel the world around them. Whiskers help the rat navigate their world, orient themselves and balance, using them to find and discriminate food, court a mate and determine if they can fit through openings.</p></div>']
    },

    {
      id: "legs",
      content: [
'<div><img src="%configBaseUrl%/images/legs_m.jpg" alt="Legs"><p>Brown rats are keen burrowers and powerful swimmers. They can jump vertically more than 77cm, and 120cm horizontally. Rats are also strong in the water, capable of swimming for 72 hours non-stop.</p></div>',

'<div><img src="%configBaseUrl%/images/legs_t.jpg" alt="Legs"><p>Brown rats are keen burrowers and powerful swimmers. They can jump vertically more than 77cm, and 120cm horizontally. Rats are also strong in the water, capable of swimming for 72 hours non-stop.</p></div>',

'<div><img src="%configBaseUrl%/images/legs_d.jpg" alt="Legs"><p>Brown rats are keen burrowers and powerful swimmers. They can jump vertically more than 77cm, and 120cm horizontally. Rats are also strong in the water, capable of swimming for 72 hours non-stop.</p></div>']
    },

    {
      id: "tail",
      content: [
'<div><img src="%configBaseUrl%/images/tail_m.jpg" alt="Tail"><p>A rat’s tail offers a few functions, the main one being to provide balance. The tail also offers stability when rats stand on their back legs to gain access to new areas or food. Rats also regulate their body temperature using their tails, which have a rich blood supply close to the surface.</p></div>',

'<div><img src="%configBaseUrl%/images/tail_t.jpg" alt="Tail"><p>A rat’s tail offers a few functions, the main one being to provide balance. The tail also offers stability when rats stand on their back legs to gain access to new areas or food. Rats also regulate their body temperature using their tails, which have a rich blood supply close to the surface.</p></div>',

'<div><img src="%configBaseUrl%/images/tail_d.jpg" alt="Tail"><p>A rat’s tail offers a few functions, the main one being to provide balance. The tail also offers stability when rats stand on their back legs to gain access to new areas or food. Rats also regulate their body temperature using their tails, which have a rich blood supply close to the surface.</p></div>']
    },

    {
      id: "repro",
      content: [
'<div><img src="%configBaseUrl%/images/repro_m.jpg" alt="repro"><p>Rats are prolific breeders, and courtship and mating can occur in about two seconds. A female rat can mate as many as 500 times with various males during a six-hour period of receptivity - a state she experiences about 15 times per year. A pair of brown rats can produce as many as 200 babies and 2,000 descendants in a year.</p></div>',

'<div><img src="%configBaseUrl%/images/repro_t.jpg" alt="repro"><p>Rats are prolific breeders, and courtship and mating can occur in about two seconds. A female rat can mate as many as 500 times with various males during a six-hour period of receptivity - a state she experiences about 15 times per year. A pair of brown rats can produce as many as 200 babies and 2,000 descendants in a year.</p></div>',

'<div><img src="%configBaseUrl%/images/repro_d.jpg" alt="repro"><p>Rats are prolific breeders, and courtship and mating can occur in about two seconds. A female rat can mate as many as 500 times with various males during a six-hour period of receptivity - a state she experiences about 15 times per year. A pair of brown rats can produce as many as 200 babies and 2,000 descendants in a year.</p></div>']
    }
  ];



// replace '%configBaseUrl%' with the real base url
function updateWithBaseUrl(text){
text = text || "";
return text.replace(/%configBaseUrl%/gi, config.baseUrl);
}


  return {
    createMarkup : function(container, callback) {

      // clear the container
      container.innerHTML = '';


      // create the markup
      var mainContainer = document.createElement('div');
      mainContainer.className = 'module-interactive-diagram';
      mainContainer.id = 'rattus';

      var imageContainer = document.createElement('div');
      imageContainer.className = 'module-interactive-diagram-image-area';
      mainContainer.appendChild(imageContainer);

      var backgroundImage = document.createElement('img');
      backgroundImage.src = config.baseUrl + '/images/rat_m.jpg';
      imageContainer.appendChild(backgroundImage);

      var instructionsDiv = document.createElement('div');
      instructionsDiv.className = 'instructions-holder';
      instructionsDiv.innerHTML = '<p class="title">Instructions</p><hr><p>Click to explore</p>';
      mainContainer.appendChild(instructionsDiv);

      var interactiveDiagramTextArea = document.createElement('div');
      interactiveDiagramTextArea.className = 'module-interactive-diagram-text-area';
      mainContainer.appendChild(interactiveDiagramTextArea);

      for (var i = 0; i < labelDescriptions.length; i++) {
        var description = document.createElement('div');
        description.className = 'interactive-diagram-text-content';
        description.id = labelDescriptions[i].id;
        for(var j = 0; j < labelDescriptions[i].content.length; j++){
            var content = updateWithBaseUrl(labelDescriptions[i].content[j]);
            description.innerHTML = description.innerHTML + content;
        }
        interactiveDiagramTextArea.appendChild(description);
      }

      container.appendChild(mainContainer);



      //add the css     
      var css = document.createElement('link');
      // this is what will take the longest, so we attach the callback
      // so that it only starts the module once the css is loaded
      var url = config.baseUrl + '/sdk/interactive-diagram.css';



      //css.addEventListener('load', callback);
      css.rel = 'stylesheet';
      css.href = url;
      css.type = 'text/css';

      var img = document.createElement('img');
        img.onerror = function(){
            if(callback) callback();
        }
        img.src = url;

        document.querySelector('head').appendChild(css);      

    },

    init: function(cfg) {
      config = cfg;

        var responsiveImagePaths = [
            {image: config.baseUrl + "/images/rat_m.jpg"}, //Mobiles.. (small image)
            {image: config.baseUrl + "/images/rat_t.jpg"}, //Tablets.. (large image)
            {image: config.baseUrl + "/images/rat_d.jpg"}  //Desktop.. (medium image)
        ];

      var module = new interactiveDiagram();
      
      // only call init once all the markup has loaded
      this.createMarkup(config.container, function() {                       //showLabels?
        module.init(module.contextManager, labels, responsiveImagePaths, "#rattus", false)
      });

    }
  };
});