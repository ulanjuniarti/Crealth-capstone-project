const tf = require('@tensorflow/tfjs-node');
const { getModel } = require('./loadModel');
const { convertSymptomsToNumeric } = require('./convertSymptoms');

const diseaseInfo = {
  "Reaksi Obat": {
    "description":"Reaksi obat yang tidak diinginkan (ADR) adalah cedera yang disebabkan oleh penggunaan obat. ADR dapat terjadi setelah pemberian obat dalam dosis tunggal atau dalam jangka waktu yang lama, atau akibat kombinasi dua atau lebih obat.",
    "prevention":["hentikan iritasi","konsultasikan dengan rumah sakit terdekat","berhenti minum obat","tindak lanjut"]
},
"Malaria": {
"description":"Malaria adalah penyakit menular yang disebabkan oleh parasit protozoa dari keluarga Plasmodium yang dapat ditularkan melalui gigitan nyamuk Anopheles atau melalui jarum suntik atau transfusi yang terkontaminasi. Malaria falciparum adalah jenis yang paling mematikan.",
"prevention":["Konsultasikan dengan rumah sakit terdekat","hindari makanan berminyak","hindari makanan yang bukan sayuran","jauhkan nyamuk"]
},
"Alergi": {
"description":"Alergi adalah respons sistem kekebalan tubuh terhadap zat asing yang biasanya tidak berbahaya bagi tubuh Anda, yang dapat berupa makanan tertentu, serbuk sari, atau bulu hewan peliharaan. Tugas sistem kekebalan tubuh Anda adalah menjaga Anda tetap sehat dengan melawan patogen berbahaya.",
"prevention":["oleskan calamine","tutupi area dengan perban","gunakan es untuk mengompres rasa gatal"]
},
"Hipotiroidisme": {
"description":"Hipotiroidisme, juga disebut tiroid kurang aktif atau tiroid rendah, adalah kelainan pada sistem endokrin di mana kelenjar tiroid tidak menghasilkan hormon tiroid yang cukup.",
"prevention":["mengurangi stres","berolahraga","makan yang sehat","tidur yang nyenyak"]
},
"Psoriasis": {
"description":"Psoriasis adalah kelainan kulit umum yang membentuk bercak tebal, merah, dan bergelombang yang ditutupi sisik keperakan. Bercak ini dapat muncul di mana saja, tetapi sebagian besar muncul di kulit kepala, siku, lutut, dan punggung bagian bawah. Psoriasis tidak dapat ditularkan dari orang ke orang. Kadang-kadang terjadi pada anggota keluarga yang sama.",
"prevention":["cuci tangan dengan air sabun hangat","hentikan pendarahan dengan menggunakan tekanan","konsultasikan dengan dokter","mandi garam"]
},
"GERD": {
"description":"Penyakit refluks gastroesofagus, atau GERD, adalah gangguan pencernaan yang memengaruhi sfingter esofagus bagian bawah (LES), yaitu cincin otot di antara kerongkongan dan lambung. Banyak orang, termasuk wanita hamil, menderita nyeri ulu hati atau gangguan pencernaan asam yang disebabkan oleh GERD.",
"prevention":["hindari makanan pedas berlemak","hindari berbaring setelah makan","menjaga berat badan yang sehat","olahraga"]
},
"Kolestasis Kronis": {
"description":"Penyakit kolestatik kronis, baik yang terjadi pada masa bayi, masa kanak-kanak maupun dewasa, ditandai dengan rusaknya transportasi asam empedu dari hati ke usus, yang dalam banyak kasus disebabkan oleh kerusakan primer pada epitel empedu.",
"prevention":["mandi air dingin","obat anti gatal","berkonsultasi dengan dokter","makan yang sehat"]
},
"Hepatitis A": {
"description":"Hepatitis A adalah infeksi hati yang sangat menular yang disebabkan oleh virus hepatitis A. Virus ini adalah salah satu dari beberapa jenis virus hepatitis yang menyebabkan peradangan dan memengaruhi kemampuan hati Anda untuk berfungsi.",
"prevention":["Konsultasikan dengan rumah sakit terdekat","cuci tangan sampai bersih","hindari makanan pedas berlemak","pengobatan"]
},
"Osteoartritis": {
"description":"Osteoartritis adalah bentuk radang sendi yang paling umum, yang memengaruhi jutaan orang di seluruh dunia. Ini terjadi ketika tulang rawan pelindung yang melindungi ujung tulang Anda melemah seiring waktu.",
"prevention":["asetaminofen","konsultasikan dengan rumah sakit terdekat","menindaklanjuti","mandi garam"]
},
"(vertigo) Vertigo Posisi Paroymsal": {
"description":"Vertigo posisi paroksismal jinak (BPPV) adalah salah satu penyebab vertigo yang paling umum - sensasi tiba-tiba bahwa Anda berputar atau bagian dalam kepala Anda berputar. Vertigo posisi paroksismal jinak menyebabkan episode singkat pusing ringan hingga intens.",
"prevention":["berbaring","hindari perubahan mendadak pada tubuh","hindari gerakan kepala secara tiba-tiba","rileks"]
},
"Hipoglikemia": {
"description":" Hipoglikemia adalah suatu kondisi di mana kadar gula darah (glukosa) Anda lebih rendah dari normal. Glukosa adalah sumber energi utama tubuh Anda. Hipoglikemia sering dikaitkan dengan pengobatan diabetes. Namun, obat lain dan berbagai kondisi - banyak yang jarang terjadi - dapat menyebabkan gula darah rendah pada orang yang tidak menderita diabetes.",
"prevention":["berbaring miring","periksa denyut nadi","minum minuman manis","berkonsultasi dengan dokter"]
},
"Jerawat": {
"description":"Jerawat vulgaris adalah pembentukan komedo, papula, pustula, nodul, dan/atau kista akibat penyumbatan dan peradangan pada unit pilosebasea (folikel rambut dan kelenjar sebasea yang menyertainya). Jerawat berkembang di wajah dan tubuh bagian atas. Ini paling sering menyerang remaja.",
"prevention":["mandi dua kali","hindari makanan pedas berlemak","minum banyak air","hindari terlalu banyak produk"]
},
"Diabetes": {
"description":"Diabetes adalah penyakit yang terjadi ketika glukosa darah Anda, yang juga disebut gula darah, terlalu tinggi. Glukosa darah adalah sumber energi utama Anda dan berasal dari makanan yang Anda makan. Insulin, hormon yang dibuat oleh pankreas, membantu glukosa dari makanan masuk ke dalam sel untuk digunakan sebagai energi.",
"prevention":["memiliki diet seimbang","berolahraga","konsultasikan dengan dokter","menindaklanjuti"]
},
"Impetigo": {
"description":"Impetigo (im-puh-TIE-go) adalah infeksi kulit yang umum dan sangat menular yang terutama menyerang bayi dan anak-anak. Impetigo biasanya muncul sebagai luka merah di wajah, terutama di sekitar hidung dan mulut anak, serta di tangan dan kaki. Luka ini akan pecah dan membentuk kerak berwarna madu.",
"prevention":["rendam area yang terkena dalam air hangat","gunakan antibiotik","bersihkan keropeng dengan kain basah yang dikompres","berkonsultasi dengan dokter"]
},
"Hipertensi": {
"description":"Hipertensi (HTN atau HT), juga dikenal sebagai tekanan darah tinggi (HBP), adalah kondisi medis jangka panjang di mana tekanan darah di arteri terus meningkat. Tekanan darah tinggi biasanya tidak menimbulkan gejala.",
"prevention":["meditasi","mandi garam","mengurangi stres","tidur yang nyenyak"]
},
"Penyakit Ulkus Peptikum": {
"description":"Penyakit tukak lambung (PUD) adalah luka pada lapisan dalam lambung, bagian pertama dari usus kecil, atau kadang-kadang kerongkongan bagian bawah. Tukak di lambung disebut tukak lambung, sedangkan tukak di bagian pertama usus adalah tukak duodenum.",
"prevention":["hindari makanan pedas berlemak","mengkonsumsi makanan probiotik","menghilangkan susu","batasi alkohol"]
},
"Wasir Dimorfik (Ambeien)": {
"description":"Wasir, juga dieja wasir, adalah struktur pembuluh darah di saluran anus. Dalam ... Nama lain, Wasir, ambeien, penyakit ambeien.",
"prevention":["hindari makanan pedas berlemak","mengkonsumsi witch hazel","mandi air hangat dengan garam epsom","konsumsi jus alovera"]
},
"Flu Biasa": {
"description":"Pilek adalah infeksi virus pada hidung dan tenggorokan (saluran pernapasan bagian atas). Biasanya tidak berbahaya, meskipun mungkin tidak terasa seperti itu. Banyak jenis virus yang dapat menyebabkan flu biasa.",
"prevention":["minum minuman kaya vitamin c","mengambil uap","hindari makanan dingin","jaga agar demam tetap terkendali"]
},
"Cacar Air": {
"description":"Cacar air adalah penyakit yang sangat menular yang disebabkan oleh virus varicella-zoster (VZV). Penyakit ini dapat menyebabkan ruam yang gatal dan melepuh. Ruam pertama kali muncul di dada, punggung, dan wajah, lalu menyebar ke seluruh tubuh, menyebabkan antara 250 hingga 500 lepuhan yang gatal.",
"prevention":["gunakan mimba saat mandi" ,"mengkonsumsi daun mimba","ambil vaksin","hindari tempat umum"]
},
"Spondilosis Serviks": {
"description":"Spondilosis servikal adalah istilah umum untuk keausan yang berkaitan dengan usia yang memengaruhi cakram tulang belakang di leher Anda. Ketika diskus mengalami dehidrasi dan menyusut, tanda-tanda osteoartritis akan muncul, termasuk proyeksi tulang di sepanjang tepi tulang (taji tulang).",
"prevention":["gunakan bantal pemanas atau kompres dingin","olahraga","minum pereda nyeri otc","berkonsultasi dengan dokter"]
},
"Hipertiroidisme": {
"description":"Hipertiroidisme (tiroid yang terlalu aktif) terjadi ketika kelenjar tiroid Anda memproduksi terlalu banyak hormon tiroksin. Hipertiroidisme dapat mempercepat metabolisme tubuh Anda, menyebabkan penurunan berat badan yang tidak disengaja dan detak jantung yang cepat atau tidak teratur.",
"prevention":["makan yang sehat","pijat","gunakan lemon balm","menjalani pengobatan yodium radioaktif"]
},
"Infeksi Saluran Kemih": {
"description":"Infeksi saluran kemih: Infeksi pada ginjal, ureter, kandung kemih, atau uretra. Disingkat ISK. Tidak semua orang yang mengalami ISK memiliki gejala, tetapi gejala yang umum termasuk sering ingin buang air kecil dan rasa sakit atau terbakar saat buang air kecil.",
"prevention":["minum banyak air","meningkatkan asupan vitamin c","minum jus cranberry","minum probiotik"]
},
"Varises": {
"description":"Vena yang telah membesar dan terpelintir, sering kali tampak sebagai pembuluh darah yang menonjol dan berwarna biru, yang terlihat jelas melalui kulit. Varises paling sering terjadi pada orang dewasa yang lebih tua, terutama wanita, dan terjadi terutama pada kaki.",
"prevention":["berbaring datar dan angkat kaki tinggi-tinggi","gunakan salep","gunakan kompresi vena","jangan berdiri diam terlalu lama"]
},
"AIDS": {
"description":"Acquired Immunodeficiency Syndrome (AIDS) adalah suatu kondisi kronis yang berpotensi mengancam jiwa yang disebabkan oleh Human Immunodeficiency Virus (HIV). Dengan merusak sistem kekebalan tubuh Anda, HIV mengganggu kemampuan tubuh Anda untuk melawan infeksi dan penyakit.",
"prevention":["hindari luka terbuka","pakai ppe jika memungkinkan","berkonsultasi dengan dokter","menindaklanjuti"]
},
"Kelumpuhan (Pendarahan Otak)": {
"description":"Acquired Immunodeficiency Syndrome (AIDS) adalah suatu kondisi kronis yang berpotensi mengancam jiwa yang disebabkan oleh Human Immunodeficiency Virus (HIV). Dengan merusak sistem kekebalan tubuh Anda, HIV mengganggu kemampuan tubuh Anda untuk melawan infeksi dan penyakit.",
"prevention":["pijat","makan sehat","olahraga","berkonsultasi dengan dokter"]
},
"Tifus": {
"description":"Penyakit akut yang ditandai dengan demam yang disebabkan oleh infeksi bakteri Salmonella typhi. Demam tifoid memiliki gejala awal yang berbahaya, dengan demam, sakit kepala, sembelit, tidak enak badan, menggigil, dan nyeri otot. Diare jarang terjadi, dan muntah biasanya tidak parah.",
"prevention":["makan sayuran berkalori tinggi","terapi antibiotik","berkonsultasi dengan dokter","pengobatan"]
},
"Hepatitis B": {
"description":"Hepatitis B adalah infeksi pada hati Anda. Infeksi ini dapat menyebabkan jaringan parut pada organ, gagal hati, dan kanker. Hal ini dapat berakibat fatal jika tidak diobati. Penyakit ini menyebar ketika orang bersentuhan dengan darah, luka terbuka, atau cairan tubuh seseorang yang mengidap virus hepatitis B.",
"prevention":["konsultasikan dengan rumah sakit terdekat","vaksinasi","makan sehat","pengobatan"]
},
"Infeksi Jamur": {
"description":"Pada manusia, infeksi jamur terjadi ketika jamur yang menyerang mengambil alih suatu area tubuh dan terlalu banyak untuk ditangani oleh sistem kekebalan tubuh. Jamur dapat hidup di udara, tanah, air, dan tanaman. Ada juga beberapa jamur yang hidup secara alami di dalam tubuh manusia. Seperti halnya mikroba lainnya, ada jamur yang bermanfaat dan ada pula jamur yang berbahaya.",
"prevention":["mandi dua kali","gunakan detol atau mimba dalam air mandi","jaga agar area yang terinfeksi tetap kering","gunakan pakaian yang bersih"]
},
"Hepatitis C": {
"description":"Peradangan hati akibat virus hepatitis C (HCV), yang biasanya menyebar melalui transfusi darah (jarang terjadi), hemodialisis, dan penggunaan jarum suntik. Kerusakan yang ditimbulkan oleh hepatitis C pada hati dapat menyebabkan sirosis dan komplikasinya serta kanker.",
"prevention":["Berkonsultasi dengan rumah sakit terdekat","vaksinasi","makan sehat","pengobatan"]
},
"Migrain": {
"description":"",
"prevention":["meditasi","mengurangi stres","gunakan kacamata poloroid di bawah sinar matahari","berkonsultasi dengan dokter"]
},
"Asma Bronkial": {
"description":"Asma bronkial adalah suatu kondisi medis yang menyebabkan saluran udara di paru-paru membengkak dan menyempit. Karena pembengkakan ini, jalur udara menghasilkan lendir berlebih sehingga sulit bernapas, yang mengakibatkan batuk, napas pendek, dan mengi. Penyakit ini bersifat kronis dan mengganggu pekerjaan sehari-hari.",
"prevention":["beralih ke pakaian longgar","tarik napas dalam-dalam","menjauh dari pemicu","mencari bantuan"]
},
"Hepatitis Alkoholik": {
"description":"Hepatitis alkoholik adalah kondisi peradangan hati yang disebabkan oleh konsumsi alkohol dalam jumlah besar dalam jangka waktu yang lama. Kondisi ini juga diperparah oleh pesta minuman keras dan penggunaan alkohol secara terus-menerus. Jika Anda mengalami kondisi ini, Anda harus berhenti minum alkohol.",
"prevention":["hentikan konsumsi alkohol","berkonsultasi dengan dokter","pengobatan","menindaklanjuti"]
},
"Penyakit Kuning": {
"description":"Pewarnaan kuning pada kulit dan sklera (bagian putih mata) oleh kadar pigmen empedu bilirubin dalam darah yang abnormal. Warna kuning meluas ke jaringan dan cairan tubuh lainnya. Penyakit kuning pernah disebut “morbus regius” (penyakit agung) dengan keyakinan bahwa hanya sentuhan seorang raja yang dapat menyembuhkannya.",
"prevention":["minum banyak air","mengkonsumsi milk thistle","makan buah-buahan dan makanan berserat tinggi","pengobatan"]
},
"Hepatitis E": {
"description":"Suatu bentuk peradangan hati yang jarang terjadi yang disebabkan oleh infeksi virus hepatitis E (HEV). Penyakit ini ditularkan melalui makanan atau minuman yang ditangani oleh orang yang terinfeksi atau melalui pasokan air yang terinfeksi di daerah di mana tinja dapat masuk ke dalam air. Hepatitis E tidak menyebabkan penyakit hati kronis.",
"prevention":["hentikan konsumsi alkohol","istirahat","berkonsultasi dengan dokter","pengobatan"]
},
"Demam Berdarah": {
"description":"Demam Berdarah Dengue (DBD) adalah penyakit infeksi akut yang disebabkan oleh flavivirus (virus Dengue dari genus Flavivirus), ditularkan oleh nyamuk aedes, dan ditandai dengan sakit kepala, nyeri sendi yang parah, dan ruam. Disebut juga demam patah tulang, demam berdarah.",
"prevention":["minum jus daun pepaya","hindari makanan pedas berlemak","jauhkan nyamuk","tetap terhidrasi"]
},
"Hepatitis D": {
"description":"Hepatitis D, juga dikenal sebagai virus hepatitis delta, adalah infeksi yang menyebabkan hati meradang. Pembengkakan ini dapat mengganggu fungsi hati dan menyebabkan masalah hati jangka panjang, termasuk jaringan parut hati dan kanker. Kondisi ini disebabkan oleh virus hepatitis D (HDV).",
"prevention":["berkonsultasi dengan dokter","pengobatan","makan makanan yang sehat","menindaklanjuti"]
},
"Serangan Jantung": {
"description":"Kematian otot jantung akibat hilangnya suplai darah. Hilangnya suplai darah biasanya disebabkan oleh penyumbatan total pada arteri koroner, salah satu arteri yang memasok darah ke otot jantung.",
"prevention":["berkonsultasi dengan dokter","pengobatan","istirahat","tindak lanjut"]
},
"Pneumonia": {
"description":"Pneumonia adalah infeksi pada salah satu atau kedua paru-paru. Bakteri, virus, dan jamur adalah penyebabnya. Infeksi ini menyebabkan peradangan pada kantung udara di paru-paru Anda, yang disebut alveoli. Alveoli terisi cairan atau nanah, sehingga Anda sulit bernapas.",
"prevention":["berkonsultasi dengan dokter","pengobatan","istirahat","tindak lanjut"]
},
"Artritis": {
"description":"Artritis adalah pembengkakan dan nyeri pada satu atau lebih sendi Anda. Gejala utama artritis adalah nyeri sendi dan kekakuan, yang biasanya memburuk seiring bertambahnya usia. Jenis artritis yang paling umum adalah osteoartritis dan artritis reumatoid.",
"prevention":["olahraga","gunakan terapi panas dan dingin","coba akupunktur","pijat"]
},
"Gastroenteritis": {
"description":"Gastroenteritis adalah peradangan pada saluran pencernaan, terutama lambung, dan usus besar dan kecil. Gastroenteritis akibat virus dan bakteri adalah infeksi usus yang berhubungan dengan gejala diare, kram perut, mual, dan muntah.",
"prevention":["berhenti makan makanan padat untuk sementara waktu","cobalah minum sedikit demi sedikit air","istirahat","kemudahan kembali makan"]
},
"Tuberkulosis": {
"description":"Tuberkulosis (TBC) adalah penyakit menular yang biasanya disebabkan oleh bakteri Mycobacterium tuberculosis (MTB). Tuberkulosis umumnya menyerang paru-paru, tetapi juga dapat menyerang bagian tubuh lainnya. Sebagian besar infeksi tidak menunjukkan gejala, dalam hal ini dikenal sebagai TBC laten.",
"prevention":["tutup mulut","berkonsultasi dengan dokter","pengobatan","istirahat"]
},
};

const diseaseNames = [
  "Reaksi Obat",
  "Malaria",
  "Alergi",
  "Hipotiroidisme",
  "Psoriasis",
  "GERD",
  "Kolestasis Kronis",
  "Hepatitis A",
  "Osteoartritis",
  "(vertigo) Vertigo Posisi Paroymsal",
  "Hipoglikemia",
  "Jerawat",
  "Diabetes",
  "Impetigo",
  "Hipertensi",
  "Penyakit Ulkus Peptikum",
  "Wasir Dimorfik (Ambeien)",
  "Flu Biasa",
  "Cacar Air",
  "Spondilosis Serviks",
  "Hipertiroidisme",
  "Infeksi Saluran Kemih",
  "Varises",
  "AIDS",
  "Kelumpuhan (Pendarahan Otak)",
  "Tifus",
  "Hepatitis B",
  "Infeksi Jamur",
  "Hepatitis C",
  "Migrain",
  "Asma Bronkial",
  "Hepatitis Alkoholik",
  "Penyakit Kuning",
  "Hepatitis E",
  "Demam Berdarah",
  "Hepatitis D",
  "Serangan Jantung",
  "Pneumonia",
  "Artritis",
  "Gastroenteritis",
  "Tuberkulosis"
];

const predictDisease = async (symptoms) => {
  const model = getModel();
  if (!model) {
    throw new Error('Model not loaded');
  }

  const numericSymptoms = convertSymptomsToNumeric(symptoms);
  const inputTensor = tf.tensor2d([numericSymptoms]);

  console.log("Input Symptoms:", symptoms);
  console.log("Numeric Symptoms:", numericSymptoms);
  console.log("Input Tensor:", inputTensor.arraySync());

  const prediction = model.predict(inputTensor);
  const predictionArray = prediction.arraySync()[0];

  console.log("Prediction Array:", predictionArray);

  const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
  const diseaseName = diseaseNames[maxIndex];

  console.log("Predicted Disease Name:", diseaseName);

  if (!diseaseInfo[diseaseName]) {
    throw new Error('Disease information not found');
  }

  const { description, prevention } = diseaseInfo[diseaseName];
  return { disease: diseaseName, description, prevention };
};

module.exports = { predictDisease };