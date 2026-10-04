const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'drinkit/backend/src/data/real-products.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const images = {
  "Old Monk XXX Rum": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Rum_glass.jpg/800px-Rum_glass.jpg",
  "Kingfisher Premium Lager": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Glass_of_beer.jpg/800px-Glass_of_beer.jpg",
  "Absolut Vodka": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Absolut_Vodka.jpg/800px-Absolut_Vodka.jpg",
  "Glenfiddich 12 Year Old": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Glenfiddich_12_yo.jpg/800px-Glenfiddich_12_yo.jpg",
  "Bacardi Carta Blanca": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bacardi_Superior.jpg/800px-Bacardi_Superior.jpg",
  "Bira 91 White Ale": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Wheat_beer.jpg/800px-Wheat_beer.jpg",
  "Magic Moments Vodka": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Vodka_bottle.jpg/800px-Vodka_bottle.jpg",
  "Jack Daniel's Old No. 7": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jack_Daniel%27s.jpg/800px-Jack_Daniel%27s.jpg",
  "Sula Chenin Blanc": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/White_wine_glass.jpg/800px-White_wine_glass.jpg",
  "Smirnoff No. 21 Vodka": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Smirnoff_Red_Label.jpg/800px-Smirnoff_Red_Label.jpg",
  "Blenders Pride Rare Premium": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Whisky_bottle.jpg/800px-Whisky_bottle.jpg",
  "Royal Challenge Premium": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Whisky.jpg/800px-Whisky.jpg",
  "Captain Morgan Original Spiced Gold": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Captain_Morgan_Spiced_Gold.jpg/800px-Captain_Morgan_Spiced_Gold.jpg",
  "Heineken Lager Beer": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Heineken_bottle.jpg/800px-Heineken_bottle.jpg",
  "Jacob's Creek Classic Shiraz": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Red_wine_glass.jpg/800px-Red_wine_glass.jpg",
  "Corona Extra Beer": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Corona_Extra.jpg/800px-Corona_Extra.jpg",
  "Blue Riband Premium London Dry Gin": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Gin.jpg/800px-Gin.jpg",
  "Bombay Sapphire": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bombay_Sapphire.jpg/800px-Bombay_Sapphire.jpg",
  "Haldiram's Aloo Bhujia": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Aloo_Bhujia.jpg/800px-Aloo_Bhujia.jpg",
  "Lay's Magic Masala Chips": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Potato_chips_bowl.jpg/800px-Potato_chips_bowl.jpg",
  "Kurkure Masala Munch": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Potato_chips_bowl.jpg/800px-Potato_chips_bowl.jpg",
  "Doritos Nacho Cheese": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tortilla_chips.jpg/800px-Tortilla_chips.jpg",
  "Roasted Salted Peanuts": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Roasted_peanuts.jpg/800px-Roasted_peanuts.jpg",
  "Bingo Mad Angles": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tortilla_chips.jpg/800px-Tortilla_chips.jpg",
  "Cornitos Jalapeno Nachos": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tortilla_chips.jpg/800px-Tortilla_chips.jpg",
  "Diet Mixture": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bombay_mix.jpg/800px-Bombay_mix.jpg",
  "Pringles Sour Cream & Onion": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Potato_chips_bowl.jpg/800px-Potato_chips_bowl.jpg",
  "Too Yumm! Multigrain Chips": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Potato_chips_bowl.jpg/800px-Potato_chips_bowl.jpg",
  "Bikanervala Moong Dal": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Aloo_Bhujia.jpg/800px-Aloo_Bhujia.jpg",
  "ACT II Butter Popcorn": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Popcorn.jpg/800px-Popcorn.jpg",
  "Bikaji Bhujia Sev": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Aloo_Bhujia.jpg/800px-Aloo_Bhujia.jpg",
  "Makhanas (Fox Nuts)": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bombay_mix.jpg/800px-Bombay_mix.jpg",
  "Cheetos Cheese Puffs": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tortilla_chips.jpg/800px-Tortilla_chips.jpg"
};

const updatedData = data.map(item => ({
  ...item,
  imageUrl: images[item.name] || item.imageUrl
}));

fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
console.log('Images updated');
