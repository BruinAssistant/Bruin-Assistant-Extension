/**
 * @file A content script dedicated to performing the computation and injection
 * of travel time and distance information for each class in a user's Class Plan
 * relative to the previous class in that day. Handles no phsyical location and
 * lack of previous class accordingly.
 * 
 * @author Harrison Cassar (harrisonCassar)
 * @author Eldon Ngo (eldon3141)
 */


/**
 * Specifies the column index that the newly-injected time/distance column
 * should be in the user's Class Plan tables (mimics macro-defined constant).
 * 
 * @global
 * @constant {Number}
 * @readonly
 * @todo Consider possibly moving this to some extension-wide CONFIG module.
 */
const TIME_DIST_COL_IDX = 7;


/**
 * Coord: Holds a coordinate, composed of a Latitude and Longitude.
 * 
 * Used within location_to_coords lookup table.
 * 
 * @constructor
 * @param {Number} lat - Latitude (degrees)
 * @param {Number} lng - Longitude (degrees)
 * 
 * @see {@link location_to_coords} for current use case.
 */
function Coord(lat, lng) {
    this.lat = lat;
    this.lng = lng;
}

/**
 * Lookup table for Location to Address.
 * 
 * Used when getting the relevant class information structures when handling
 * time/dist computation and injection for a particular course in a user's
 * Class Plan. Addresses used instead of Coordinates for more accurate
 * estimations.
 * 
 * @global
 * @constant {Map<string, string>}
 * @readonly
 */
 const location_to_address = new Map([
    ["700 Westwood Plaza", "700 Westwood Plaza, Los Angeles, CA 90024"],
    ["1010 Westwood Center", "1010 Westwood Blvd, Los Angeles, CA 90024"],
    ["Ackerman Union", "308 Westwood Plaza, Los Angeles, CA 90024"],
    ["Biomedical Sciences Research Building", "615 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Boelter Hall", "580 Portola Plaza, Los Angeles, CA 90095"],
    ["Botany Building", "618 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Boyer Hall", "611 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Bradley Hall", "417 Charles E Young Drive West, Los Angeles, CA 90024"],
    ["Brain Mapping Center", "660 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Brain Research Institute", "695 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Broad Art Center", "240 Charles E Young Dr N, Los Angeles, CA 90095"],
    ["Bunche Hall", "11282 Portola Plaza, Los Angeles, CA 90095"],
    ["California NanoSystems Institute", "570 Westwood Plaza Building 114, Los Angeles, CA 90095"],
    ["Campbell Hall", "335 Portola Plaza, Los Angeles, CA 90095"],
    ["Canyon Point", "Covel Steps, Los Angeles, CA 90024"],
    ["Carnesale Commons", "251 Charles E Young Drive West, Los Angeles, CA 90095"],
    ["Center for the Health Sciences", "10833 Le Conte Ave, Los Angeles, CA 90024"],
    ["Collins Center for Executive Education", "110 Westwood Plaza, Los Angeles, CA 90095"],
    ["Cornell Hall", "110 Westwood Plaza, Los Angeles, CA 90077"],
    ["Covel Commons", "330 De Neve Dr, Los Angeles, CA 90095"],
    ["De Neve Plaza Commons Building", "351 Charles E Young Drive West, Los Angeles, CA 90024"],
    ["Dentistry, School of", "714 Tiverton Ave, Los Angeles, CA 90024"],
    ["Dodd Hall", "315 Portola Plaza, Los Angeles, CA 90095"],
    ["Downtown Center", "600 Wilshire Blvd #870, Los Angeles, CA 90017"],
    ["East Melnitz Hall", "235 Charles E Young Dr N, Los Angeles, CA 90095"],
    ["Education and Information Studies Building", "457 Portola Plaza, Los Angeles, CA 90095"],
    ["Engineering I", "7400 Boelter Hall, Los Angeles, CA 90095"],
    ["Engineering IV", "Engineering IV, Los Angeles, CA 90095"],
    ["Engineering V", "Engineering V, Los Angeles, CA 90095"],
    ["Engineering VI", "404 Westwood Plaza, Los Angeles, CA 90095"],
    ["Entrepreneurs Hall", "110 Westwood Plaza, Los Angeles, CA 90077"],
    ["Factor Health Sciences Building", "650 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Fernald Center", "320 Charles E Young Dr N, Los Angeles, CA 90095"],
    ["Field", "UCLA Intramural Fields, Los Angeles, CA 90095"],
    ["Fowler Museum at UCLA", "308 Charles E Young Dr N, Los Angeles, CA 90024"],
    ["Franz Hall", "502 Portola Plaza, Los Angeles, CA 90095"],
    ["Geffen Hall", "885 Tiverton Dr, Los Angeles, CA 90024"],
    ["Geology Building", "595 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Gold Hall", "Gold Hall, Royce Dr, Los Angeles, CA 90024"],
    ["Gonda (Goldschmied) Neuroscience and Genetics Research Center", "695 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Haines Hall", "375 Portola Plaza, Los Angeles, CA 90095"],
    ["Hammer Museum", "10899 Wilshire Blvd, Los Angeles, CA 90024"],
    ["Hedrick Hall", "250 De Neve Dr, Los Angeles, CA 90024"],
    ["Hershey Hall", "801 Hilgard Ave, Los Angeles, CA 90095"],
    ["Hitch Residential Suites", "245 De Neve Dr, Los Angeles, CA 90024"],
    ["Humanities Building", "12001 Chalon Rd, Los Angeles, CA 90049"],
    ["James West Center", "James West Alumni Center, Los Angeles, CA 90095"],
    ["Jules Stein Eye Institute", "100 Stein Plaza Driveway, Los Angeles, CA 90095"],
    ["Kaufman Hall", "120 Westwood Plaza, Los Angeles, CA 90095"],
    ["Kerckhoff Hall", "308 Westwood Plaza, Los Angeles, CA 90095"],
    ["Kinsey Science Teaching Pavilion", "Kinsey Pavilion, Los Angeles, CA 90095"],
    ["Knudsen Hall", "475 Portola Plaza, Los Angeles, CA 90095"],
    ["Korn Convocation Hall", "Korn Convocation Hall, Los Angeles, CA 90095"],
    ["La Kretz Garden Pavilion", "707 Tiverton Dr, Los Angeles, CA 90095"],
    ["La Kretz Hall", "619 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Lab School 1", "330 Charles E Young Dr N, Los Angeles, CA 90095"],
    ["Law Building", "385 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Life Sciences", "610 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Lu Valle Commons", "Lu Valle Commons, 398 Portola Plaza, Los Angeles, CA 90095"],
    ["MacDonald Medical Research Laboratories", "675 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Macgowan Hall", "245 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Macgowan Hall East", "243 Charles E Young Dr E, Los Angeles, CA 90024"],
    ["Marion Anderson Hall", "110 Westwood Plaza, Los Angeles, CA 90024"],
    ["Marion Davies Children's Center", "805 Tiverton Dr, Los Angeles, CA 90024"],
    ["Mathematical Sciences", "520 Portola Plaza, Los Angeles, CA 90095"],
    ["Medical Plaza 100", "100 Medical Plaza Driveway, Los Angeles, CA 90024"],
    ["Medical Plaza 200", "200 Medical Plaza Driveway, Los Angeles, CA 90024"],
    ["Medical Plaza 300", "300 Medical Plaza Driveway St 2100, Los Angeles, CA 90095"],
    ["Melnitz Hall", "235 Charles E Young Dr E, Los Angeles, CA 90024"],
    ["Molecular Sciences Building", "619 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Moore Hall", "457 Portola Plaza, Los Angeles, CA 90095"],
    ["Morton Medical Building", "200 Medical Plaza Driveway, Los Angeles, CA 90024"],
    ["Murphy Hall", "410 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Neuroscience Research Building", "635 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["No facility", null],
    ["No Location", null],
    ["Northwest Campus Auditorium", "350 De Neve Dr, Los Angeles, CA 90024"],
    ["Off campus", null],
    ["Online", null],
    ["Online - Recorded", null],
    ["Orthopaedic Hospital Research Center", "615 Charles E Young Dr S Rm. 410, Los Angeles, CA 90095"],
    ["Ostin Music Center", "445 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Perloff Hall", "365 Portola Plaza, Los Angeles, CA 90095"],
    ["Physics and Astronomy Building", "430 Portola Plaza, Los Angeles, CA 90095"],
    ["Portola Plaza Building", "460 Portola Plaza, Los Angeles, CA 90095"],
    ["Powell Library Building", "10740 Dickson Ct, Los Angeles, CA 90095"],
    ["Pritzker Hall", "502 Portola Plaza, Los Angeles, CA 90095"],
    ["Public Affairs Building", "337 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Public Health, School of", "650 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["Reed Neurological Research Center", "710 Westwood Plaza, Los Angeles, CA 90095"],
    ["Renee and David Kaplan Hall", "415 Portola Plaza, Los Angeles, CA 90095"],
    ["Rieber Hall", "310 De Neve Dr, Los Angeles, CA 90024"],
    ["Rolfe Hall", "Rolfe Hall, Los Angeles, CA 90095"],
    ["Rosenfeld Library", "110 Westwood Plaza, Los Angeles, CA 90095"],
    ["Royce Hall", "10745 Dickson Ct, Los Angeles, CA 90095"],
    ["Schoenberg Music Building", "445 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Sculpture Garden", "Franklin D. Murphy Sculpture Garden, 245 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Semel Institute for Neuroscience and HumanBehavior", "760 Westwood Plaza, Los Angeles, CA 90024"],
    ["Slichter Hall", "603 Charles E Young Dr E, Los Angeles, CA 90024"],
    ["Sproul Hall", "350 De Neve Dr, Los Angeles, CA 90024"],
    ["Strathmore Building", "501 Westwood Plaza Strathmore Building, Los Angeles, CA 90095"],
    ["Student Activities Center", "220 Westwood Plaza, Los Angeles, CA 90095"],
    ["Terasaki Life Sciences Building", "610 Charles E Young Dr S, Los Angeles, CA 90095"],
    ["UCLA Lab School, Seeds Campus", "330 Charles E Young Dr N, Los Angeles, CA 90095"],
    ["Ueberroth Building", "10945 Le Conte Ave, Los Angeles, CA 90024"],
    ["Vatche and Tamar Manoukian Medical Building", "100 Medical Plaza Driveway, Los Angeles, CA 90024"],
    ["Wendy and Leonard Goldberg Medical Building", "300 Medical Plaza Driveway, Los Angeles, CA 90095"],
    ["West Medical", "1010 Veteran Ave, Los Angeles, CA 90095"],
    ["William Andrews Clark Memorial Library", "2520 Cimarron St, Los Angeles, CA 90018"],
    ["Wooden Recreation and Sports Center", "John R. Wooden Recreation and Sports Center, 221 Westwood Plaza, Los Angeles, CA 90095"],
    ["Young Hall", "607 Charles E Young Dr E, Los Angeles, CA 90095"],
    ["Young Research Library", "280 Charles E Young Dr N, Los Angeles, CA 90095"]
]);

/**
 * Lookup table for Location to Coordinate.
 * 
 * @global
 * @constant {Map<string, Coord>}
 * @readonly
 * @todo Update description for relevant use-case (for website integration soon).
 * 
 * @see {@link Coord} for Coord object description.
 */
const location_to_coords = new Map([
    ["700 Westwood Plaza", new Coord(34.06693695833717, -118.4448437749579)],
    ["1010 Westwood Center", new Coord(34.062367842236796, -118.44505990379362)],
    ["Ackerman Union", new Coord(34.07061783552888, -118.44420560194396)],
    ["Biomedical Sciences Research Building", new Coord(34.067354619343014, -118.44130557310837)],
    ["Boelter Hall", new Coord(34.06927673596064, -118.44314214158828)],
    ["Botany Building", new Coord(34.06699323253283, -118.44108758660148)],
    ["Boyer Hall", new Coord(34.06830107967037, -118.441655901944)],
    ["Bradley Hall", new Coord(34.069892812200564, -118.44907931543702)],
    ["Brain Mapping Center", new Coord(34.067009858138334, -118.44440165961545)],
    ["Brain Research Institute", new Coord(34.06753326915666, -118.44471388475186)],
    ["Broad Art Center", new Coord(34.07605382686575, -118.44096471543688)],
    ["Bunche Hall", new Coord(34.0744671641443, -118.44011757310827)],
    ["California NanoSystems Institute", new Coord(34.06819835504753, -118.4428800000944)],
    ["Campbell Hall", new Coord(34.073822757539055, -118.4412273000944)],
    ["Canyon Point", new Coord(34.07359230559998, -118.45103385961517)],
    ["Carnesale Commons", new Coord(34.07207665724031, -118.44949300009435)],
    ["Center for the Health Sciences", new Coord(34.066275558678655, -118.44207574612233)],
    ["Collins Center for Executive Education", new Coord(34.07370883986546, -118.44463836331438)],
    ["Cornell Hall", new Coord(34.07417213061734, -118.44339498845082)],
    ["Covel Commons", new Coord(34.073219454243, -118.44995204427262)],
    ["De Neve Plaza Commons Building", new Coord(34.07098143697784, -118.4501300866013)],
    ["Dentistry, School of", new Coord(34.066540396446705, -118.44199143077967)],
    ["Dodd Hall", new Coord(34.072770972418695, -118.43939211543696)],
    ["Downtown Center", new Coord(34.05911359159337, -118.2803091846574)],
    ["East Melnitz Hall", new Coord(34.076635172087215, -118.43942248845094)],
    ["Education and Information Studies Building", new Coord(34.070569076115106, -118.44254134427271)],
    ["Engineering I", new Coord(34.068769401762815, -118.44447121947147)],
    ["Engineering IV", new Coord(34.06924376871353, -118.44432790739828)],
    ["Engineering V", new Coord(34.06970012685327, -118.44368661543703)],
    ["Engineering VI", new Coord(34.06965066498041, -118.4437638546126)],
    ["Entrepreneurs Hall", new Coord(34.07382109198659, -118.44336680009432)],
    ["Factor Health Sciences Building", new Coord(34.06698642840647, -118.44360184420151)],
    ["Fernald Center", new Coord(34.07655532586608, -118.44284347762654)],
    ["Field", new Coord(34.07240146934583, -118.44685180194392)],
    ["Fowler Museum at UCLA", new Coord(34.073131132692396, -118.44305491543702)],
    ["Franz Hall", new Coord(34.06977549013749, -118.4412362866013)],
    ["Geffen Hall", new Coord(34.06440506221056, -118.44235545961538)],
    ["Geology Building", new Coord(34.06940011483661, -118.44055781543707)],
    ["Gold Hall", new Coord(34.07372594871459, -118.4436591384509)],
    ["Gonda (Goldschmied) Neuroscience and Genetics Research Center", new Coord(34.06542486559988, -118.44723186883748)],
    ["Haines Hall", new Coord(34.07297623721399, -118.44115199519744)],
    ["Hammer Museum", new Coord(34.0597166547792, -118.44368375961538)],
    ["Hedrick Hall", new Coord(34.07341887984911, -118.45221587495782)],
    ["Hershey Hall", new Coord(34.06679355101938, -118.43985150194395)],
    ["Hitch Residential Suites", new Coord(34.07373197909357, -118.45371793077958)],
    ["Humanities Building", new Coord(34.07171419871093, -118.44127964602781)],
    ["James West Center", new Coord(34.070471235944105, -118.4451430866012)],
    ["Jules Stein Eye Institute", new Coord(34.06491686384691, -118.44398277310833)],
    ["Kaufman Hall", new Coord(34.073965503578236, -118.4442240496137)],
    ["Kerckhoff Hall", new Coord(34.07063259934642, -118.44355748660129)],
    ["Kinsey Science Teaching Pavilion", new Coord(34.07034386178524, -118.44136834427258)],
    ["Knudsen Hall", new Coord(34.07079328618486, -118.44107564427274)],
    ["Korn Convocation Hall", new Coord(34.07387991317846, -118.44312533077957)],
    ["La Kretz Garden Pavilion", new Coord(34.06676203301789, -118.44153223077969)],
    ["La Kretz Hall", new Coord(34.06775504340902, -118.44269563077962)],
    ["Lab School 1", new Coord(34.075359640735805, -118.4441230019438)],
    ["Law Building", new Coord(34.072834670162216, -118.43873265775424)],
    ["Life Sciences", new Coord(34.06757981884672, -118.44040524427275)],
    ["Lu Valle Commons", new Coord(34.073789718271776, -118.43941739214993)],
    ["MacDonald Medical Research Laboratories", new Coord(34.06733974481398, -118.44427897310828)],
    ["Macgowan Hall", new Coord(34.07610364667738, -118.43967057310815)],
    ["Macgowan Hall East", new Coord(34.07593367869698, -118.43966751516949)],
    ["Marion Anderson Hall", new Coord(34.0740785960199, -118.44295632818209)],
    ["Marion Davies Children's Center", new Coord(34.065421750246415, -118.44198989084667)],
    ["Mathematical Sciences", new Coord(34.07079353192487, -118.44094973984707)],
    ["Medical Plaza 100", new Coord(34.06564738635145, -118.44574927495792)],
    ["Medical Plaza 200", new Coord(34.06506957561769, -118.44681577920316)],
    ["Medical Plaza 300", new Coord(34.06458524972706, -118.44606383077969)],
    ["Melnitz Hall", new Coord(34.07661101235114, -118.44000980194392)],
    ["Molecular Sciences Building", new Coord(34.06821968915325, -118.44086534677987)],
    ["Moore Hall", new Coord(34.070494834778856, -118.44261903752619)],
    ["Morton Medical Building", new Coord(34.06523159728839, -118.44547863742048)],
    ["Murphy Hall", new Coord(34.07201228637565, -118.43860514242309)],
    ["Neuroscience Research Building", new Coord(34.06765723088129, -118.44358820194387)],
    ["No facility", null],
    ["No Location", null],
    ["Northwest Campus Auditorium", new Coord(34.0721306088205, -118.45047378660131)],
    ["Off campus", null],
    ["Online", null],
    ["Online - Recorded", null],
    ["Orthopaedic Hospital Research Center", new Coord(34.0675689815136, -118.44120280194402)],
    ["Ostin Music Center", new Coord(34.07046696146252, -118.44027788660142)],
    ["Perloff Hall", new Coord(34.07366736615829, -118.44024534612211)],
    ["Physics and Astronomy Building", new Coord(34.07084656284753, -118.44158000194393)],
    ["Portola Plaza Building", new Coord(34.0703763955532, -118.44184409797171)],
    ["Powell Library Building", new Coord(34.07170168372432, -118.44215751471553)],
    ["Pritzker Hall", new Coord(34.06979737917609, -118.44075760316845)],
    ["Public Affairs Building", new Coord(34.074316015804875, -118.4385481962411)],
    ["Public Health, School of", new Coord(34.06700817053388, -118.44333609454576)],
    ["Reed Neurological Research Center", new Coord(34.06640504609998, -118.44443114666824)],
    ["Renee and David Kaplan Hall", new Coord(34.07131425924011, -118.441118715437)],
    ["Rieber Hall", new Coord(34.071877196473764, -118.45159800379358)],
    ["Rolfe Hall", new Coord(34.07395050481058, -118.44204757310818)],
    ["Rosenfeld Library", new Coord(34.074146617522885, -118.44345567310828)],
    ["Royce Hall", new Coord(34.072924325772995, -118.44218065821016)],
    ["Schoenberg Music Building", new Coord(34.07116180085136, -118.44047522468482)],
    ["Sculpture Garden", new Coord(34.07523978110291, -118.43986747521654)],
    ["Semel Institute for Neuroscience and HumanBehavior", new Coord(34.06596987154504, -118.4448672866014)],
    ["Slichter Hall", new Coord(34.06934527816948, -118.4404310270805)],
    ["Sproul Hall", new Coord(34.07214633465558, -118.44958042892998)],
    ["Strathmore Building", new Coord(34.06832776766664, -118.4452304951975)],
    ["Student Activities Center", new Coord(34.07169768711251, -118.44412921728663)],
    ["Terasaki Life Sciences Building", new Coord(34.06735914419834, -118.43988990433964)],
    ["UCLA Lab School, Seeds Campus", new Coord(34.07537041450641, -118.44410268434461)],
    ["Ueberroth Building", new Coord(34.06420631417785, -118.44689975776575)],
    ["Vatche and Tamar Manoukian Medical Building", new Coord(34.06571249653149, -118.445824201944)],
    ["Wendy and Leonard Goldberg Medical Building", new Coord(34.06468576168065, -118.44608585961541)],
    ["West Medical", new Coord(34.0605666089195, -118.44778532706898)],
    ["William Andrews Clark Memorial Library", new Coord(34.033745869528914, -118.31448379285351)],
    ["Wooden Recreation and Sports Center", new Coord(34.07127162866979, -118.44570073946167)],
    ["Young Hall", new Coord(34.06876052882566, -118.44152213130202)],
    ["Young Research Library", new Coord(34.075075721540614, -118.44095101783246)]
]);


/**
 * Lookup table for Department Name to Abbreviation/Short-Hand.
 * 
 * Used when getting the relevant class information structures when handling
 * time/dist computation and injection for a particular course in a user's
 * Class Plan.
 * 
 * @global
 * @constant {Map<string, string>}
 * @readonly
 * 
 * @todo Confirm mappings are correct.
 */
 const department_abbrev = new Map([
    ["Aerospace Studies", "AERO ST"],
    ["African American Studies", "AF AMER"],
    ["African Studies", "AFRC ST"],
    ["Afrikaans", "AFRKAAN"],
    ["American Indian Studies", "AM IND"],
    ["American Sign Language", "ASL"],
    ["Ancient Near East", "AN N EA"],
    ["Anesthesiology", "ANES"],
    ["Anthropology", "ANTHRO"],
    ["Applied Linguistics", "APPLING"],
    ["Arabic", "ARABIC"],
    ["Archaeology", "ARCHEOL"],
    ["Architecture and Urban Design", "ARCH UD"],
    ["Armenian", "ARMENIA"],
    ["Art", "ART"],
    ["Art History", "ART HIS"],
    ["Arts and Architecture", "ART ARC"],
    ["Arts Education", "ARTS ED"],
    ["Asian", "ASIAN"],
    ["Asian American Studies", "ASIA AM"],
    ["Astronomy", "ASTR"],
    ["Atmospheric and Oceanic Sciences", "A O SCI"],
    ["Bioengineering", "BIOENGR"],
    ["Bioinformatics (Graduate)", "BIOINFO"],
    ["Biological Chemistry", "BIOL CH"],
    ["Biomathematics", "BIOMATH"],
    ["Biomedical Research", "BMD RES"],
    ["Biostatistics", "BIOSTAT"],
    ["Central and East European Studies", "C EE ST"],
    ["Chemical Engineering", "CH ENGR"],
    ["Chemistry and Biochemistry", "CHEM"],
    ["Chicana and Chicano Studies", "CHICANO"],
    ["Chinese", "CHIN"],
    ["Civic Engagement", "CIVIC"],
    ["Civil and Environmental Engineering", "C EE"],
    ["Classics", "CLASSIC"],
    ["Communication Studies", "COMM ST"],
    ["Community Health Sciences", "COM HLT"],
    ["Comparative Literature", "COM LIT"],
    ["Computational and Systems Biology", "C S BIO"],
    ["Computer Science", "COM SCI"],
    ["Conservation of Archaeological and Ethnographic Materials", "CAEM"],
    ["Dance", "DANCE"],
    ["Dentistry", "DENT"],
    ["Design / Media Arts", "DESMA"],
    ["Digital Humanities", "DGT HUM"],
    ["Disability Studies", "DIS STD"],
    ["Dutch", "DUTCH"],
    ["Earth, Planetary, and Space Sciences", "EPS SCI"],
    ["Ecology and Evolutionary Biology", "EE BIOL"],
    ["Economics", "ECON"],
    ["Education", "EDUC"],
    ["Electrical Engineering", "EL ENGR"],
    ["Engineering", "ENGR"],
    ["English", "ENGL"],
    ["English as A Second Language", "ESL"],
    ["English Composition", "ENGCOMP"],
    ["Environment", "ENVIRON"],
    ["Environmental Health Sciences", "ENV HLT"],
    ["Epidemiology", "EPIDEM"],
    ["Ethnomusicology", "ETHNMUS"],
    ["Filipino", "FILIPNO"],
    ["Film and Television", "FILM TV"],
    ["French", "FRNCH"],
    ["Gender Studies", "GENDER"],
    ["General Education Clusters", "GE CLST"],
    ["Geography", "GEOG"],
    ["German", "GERMAN"],
    ["Gerontology", "GRNTLGY"],
    ["Global Studies", "GLBL ST"],
    ["Graduate Student Professional Development", "GRAD PD"],
    ["Greek", "GREEK"],
    ["Health Policy and Management", "HLT POL"],
    ["Hebrew", "HEBREW"],
    ["Hindi Urdu", "HIN URD"],
    ["History", "HIST"],
    ["Honors Collegium", "HNRS"],
    ["Human Genetics", "HUM GEN"],
    ["Hungarian", "HNGAR"],
    ["Indigenous Languages of the Americas", "IL AMER"],
    ["Indo European Studies", "I E STD"],
    ["Indonesian", "INDO"],
    ["Information Studies", "INF STD"],
    ["International and Area Studies", "I A STD"],
    ["International Development Studies", "INTL DV"],
    ["Iranian", "IRANIAN"],
    ["Islamic Studies", "ISLM ST"],
    ["Italian", "ITALIAN"],
    ["Japanese", "JAPAN"],
    ["Jewish Studies", "JEWISH"],
    ["Korean", "KOREA"],
    ["Labor and Workplace Studies", "LBR WS"],
    ["Latin", "LATIN"],
    ["Latin American Studies", "LATN AM"],
    ["Law (Undergraduate)", "UG LAW"],
    ["Lesbian, Gay, Bisexual, Transgender, and Queer Studies", "LGBTQS"],
    ["Life Sciences", "LIFESCI"],
    ["Linguistics", "LING"],
    ["Management", "MGMT"],
    ["Materials Science and Engineering", "MAT SCI"],
    ["Mathematics", "MATH"],
    ["Mechanical and Aerospace Engineering", "MECH AE"],
    ["Medical History", "MED HIS"],
    ["Medicine", "MED"],
    ["Microbiology, Immunology, and Molecular Genetics", "MIMG"],
    ["Middle Eastern Studies", "M E STD"],
    ["Military Science", "MIL SCI"],
    ["Molecular and Medical Pharmacology", "M PHARM"],
    ["Molecular Biology", "MOL BIO"],
    ["Molecular Toxicology", "MOL TOX"],
    ["Molecular, Cell, and Developmental Biology", "MCD BIO"],
    ["Molecular, Cellular, and Integrative Physiology", "MC IP"],
    ["Music", "MUSC"],
    ["Music History", "MSC HST"],
    ["Music Industry", "MSC IND"],
    ["Musicology", "MUSCLG"],
    ["Naval Science", "NAV SCI"],
    ["Near Eastern Languages", "NR EAST"],
    ["Neurobiology", "NEURBIO"],
    ["Neurology", "NEURLGY"],
    ["Neuroscience (Graduate)", "NEURO"],
    ["Neuroscience", "NEUROSC"],
    ["Nursing", "NURSING"],
    ["Obstetrics and Gynecology", "OBGYN"],
    ["Oral Biology", "ORL BIO"],
    ["Orthopaedic Surgery", "ORTHPDC"],
    ["Pathology and Laboratory Medicine", "PATH"],
    ["Philosophy", "PHILOS"],
    ["Physics", "PHYSICS"],
    ["Physics and Biology in Medicine", "PBMED"],
    ["Physiological Science", "PHYSCI"],
    ["Physiology", "PHYSIOL"],
    ["Polish", "POLSH"],
    ["Political Science", "POL SCI"],
    ["Portuguese", "PORTGSE"],
    ["Program in Computing", "COMPTNG"],
    ["Psychiatry and Biobehavioral Sciences", "PSYCTRY"],
    ["Psychology", "PSYCH"],
    ["Public Health", "PUB HLT"],
    ["Public Policy", "PUB PLC"],
    ["Religion, Study of", "RELIGN"],
    ["Romanian", "ROMANIA"],
    ["Russian", "RUSSN"],
    ["Scandinavian", "SCAND"],
    ["Science Education", "SCI EDU"],
    ["Semitic", "SEMITIC"],
    ["Serbian/Croatian", "SRB CRO"],
    ["Slavic", "SLAVC"],
    ["Social Thought", "SOC THT"],
    ["Social Welfare", "SOC WLF"],
    ["Society and Genetics", "SOC GEN"],
    ["Sociology", "SOCIOL"],
    ["South Asian", "S ASIAN"],
    ["Southeast Asian", "SEASIAN"],
    ["Spanish", "SPAN"],
    ["Statistics", "STATS"],
    ["Surgery", "SURGERY"],
    ["Swahili", "SWAHILI"],
    ["Thai", "THAI"],
    ["Theater", "THEATER"],
    ["Turkic Languages", "TURKIC"],
    ["University Studies", "UNIV ST"],
    ["Urban Planning", "URBN PL"],
    ["Vietnamese", "VIETMSE"],
    ["World Arts and Cultures", "WL ARTS"],
    ["Yiddish", "YIDDSH"],
]);


/**
 * Specification of buildings that have no physical location.
 * 
 * Used when blacklisting location names parsed from webpage, in preparation
 * for internal processing and invoking of Distance Matrix API.
 * 
 * @global
 * @constant {Array<string>}
 * @readonly
 * @todo Utilize this in blacklisting within {@link initiateTimeDistance}.
 * 
 * @see {@link buildings_blacklist} for extending/child blacklist.
 */
const buildings_no_location = ["No facility", "No Location", "Online", "Online - Recorded", "Online - Asynchronous"];


/**
 * Specification of buildings that are blacklisted for any reason (e.g. lack
 * of physical location, unknown location, etc.).
 * 
 * Used when blacklisting location names parsed from webpage, in preparation
 * for internal processing and invoking of Distance Matrix API.
 * 
 * @global
 * @constant {Array<string>}
 * @readonly
 * @todo Utilize this in blacklisting within {@link initiateTimeDistance}.
 * 
 * @see {@link buildings_no_location} for base/parent blacklist.
 * @see {@link cleanBlacklistedBuildings} for direct use case.
 */
const buildings_blacklist = buildings_no_location.concat(["Off campus"]);


/**
 * Getter function for Latitude in Coord object. Returns typecasted Number to 
 * string to prepare for Distance Matrix API call.
 * 
 * @param {Coord} building
 * @returns {String}
 */
function getLat(building){
    return (building.lat).toString();
}


/**
 * Getter function for Longitude in Coord object. Returns typecasted Number to 
 * string to prepare for Distance Matrix API call.
 * 
 * @param {Coord} building
 * @returns {String}
 */
function getLng(building){
    return (building.lng).toString();
}


/**
 * Handles Distance Matrix API call response, performing direct injection of
 * relevant information into user's Class Plan. Utilizes helper function
 * `formatTimeDistData()` to format the injected data accordingly.
 * 
 * @param {Map<String, Object>} response - Response given from Distance Matrix API call
 * @param {Map<String, Object>} parsed_class_info - Class information representing user's schedule, parsed from user's Class Planner
 * @return void
 * 
 * @see {@link formatTimeDistData} for helper formatting function.
 */
function populateTimeDistance(response, parsed_class_info) {

    // extract relevant info from parsed webpage info
    let ordered_classes = parsed_class_info.get("orderedClasses");
    let unique_buildings = Array.from(cleanBlacklistedBuildings(parsed_class_info.get("uniqueBuildings")));

    // check if offnominal response given (disabled or denied request)
    let response_disabled = (response == null);
    let response_denied = (!response_disabled && response.status == "REQUEST_DENIED");
    let offnominal_response = response_disabled || response_denied;

    if (response_denied)
        console.log("Request denied. Reason: " + response.error_message);

    // extract relevant info (distance matrix) from DistanceMatrix API response
    let td_matrix = (!offnominal_response) ? response.rows : null;

    // prepare for offnominal HTML injection (if needed)
    let offnominal_innerhtml;

    if (response_disabled)
        offnominal_innerhtml = "N/A (disabled)";
    else if (response_denied)
        offnominal_innerhtml = "N/A (denied)";

    // get overall Class Planner HTML element for parsing/injection
    let courses = document.getElementById("div_landing").getElementsByClassName("courseItem");

    // iterate through each course
    for (let course of courses) {

        // get class department and number (for class info lookups)
        let course_nameinfo = course.getElementsByClassName("SubjectAreaName_ClassName").item(0).children;
        console.log(course_nameinfo, course_nameinfo.item(0).innerText);
        let course_department = extractDepartmentFromClassRecord(course_nameinfo.item(0).innerText);
        let course_number = extractNumberFromClassRecord(course_nameinfo.item(1).innerText);

        // lookup all previous and current class infos for all days
        let class_infos = getAllCurAndPrevClassInfo(ordered_classes, department_abbrev.get(course_department), course_number);

        // get course table (holds header row, as well as all section rows)
        let course_table = course.getElementsByClassName('coursetable').item(0).getElementsByTagName('tbody');

        // init new "Distance From Previous Class" column for injection into header
        let time_dist_col = document.createElement('th');
        time_dist_col.className = "th-timedistance";
        time_dist_col.style.width = "13%";
        time_dist_col.innerHTML = "Dist<span class=\"hide-small\">ance From Previous Class</span>";

        // inject time/dist column into header at position TIME_DIST_COL_NUMBER
        let header = course_table.item(0);
        header.getElementsByTagName('th')[TIME_DIST_COL_IDX - 1].after(time_dist_col);
        // iterate through sections to inject all relevant class time/dist info
        for (let i = 1; i < course_table.length; i++) {

            // determine which section we're currently injecting for
            let section = course_table.item(i);
            let section_name = section.firstElementChild.getElementsByClassName('section-header')[0].innerText;

            // init new data element for "Distance From Previous Class" column
            let time_dist_data = document.createElement('td');
            time_dist_data.className = "td-timedistance";
            time_dist_data.innerHTML = (offnominal_response) ? offnominal_innerhtml : formatTimeDistData(td_matrix, unique_buildings, class_infos, section_name);
            section.firstElementChild.getElementsByTagName('td')[TIME_DIST_COL_IDX - 1].after(time_dist_data);
        }
    }
}


/**
 * Removes blacklisted buildings according to global constant from list.
 * 
 * @param {Array<string>} buildings
 * @return {Array<string>}
 * 
 * @see {@link buildings_blacklist} for global blacklisted buildings.
 */
function cleanBlacklistedBuildings(buildings) {

    for (let val of buildings)
    {
        if (buildings_blacklist.includes(val))
            buildings.delete(val);
    }

    return buildings;
}


/**
 * Extract relevant information from Distance Matrix and format accordingly to prepare for injection.
 * 
 * @param {Array<Array<Object>>} td_matrix - Distance Matrix of locations returned by Distance Matrix API call.
 * @param {Array<String>} buildings_idx - Array of building names, representing the indices corresponding to each building into `td_matrix`.
 * @param {Map<String,Array<Array<classInfo>>>} class_infos - Contains all applicable `classInfo` structs for classes for the corresponding section referenced by `section_name`.
 * @param {String} section_name - Name of section to format for.
 * @returns {String}
 * 
 * @see {@link classInfo}
 */
function formatTimeDistData(td_matrix, buildings_idx, class_infos, section_name) {

    // init constants that will be used/referenced during formatting
    const newline = "</br>";
    const no_data = "N/A";
    const unknown = "?";
    const day_abbrev_map = new Map([
        ['Monday','M'],
        ['Tuesday','T'],
        ['Wednesday','W'],
        ['Thursday','R'],
        ['Friday','F']
    ]);

    // init buffers/flags to be used during formatting
    let buf = "";
    let first_day_with_section = true;

    // iterate through each day
    for (let [day, class_info_pairs] of class_infos) {

        // set flag for conditional formatting
        let first_section_in_day = true;

        // iterate through each class info pair
        for (let [prev_class_info, cur_class_info] of class_info_pairs) {

            // check if current class belongs to section of interest
            if (cur_class_info.section != section_name)
                continue;

            // perform extra formatting if this is not the first day with section of interest
            if (!first_day_with_section) {
                buf += newline;
            }

            // ensure flag is set for any future additions
            first_day_with_section = false;

            // conditionally format depending on if this is the first class of this section today
            if (first_section_in_day) {
                buf += (day_abbrev_map.has(day) ? day_abbrev_map.get(day) : unknown) + ": ";
                first_section_in_day = false;
            }
            else
                buf += ", ";

            // check if current class is first in the day (no previous class, no time/dist lookup needed)
            if (prev_class_info == null) {
                buf += (no_data + " (first class)");
                continue;
            }

            // check if current class has a special or blacklisted location
            if (buildings_no_location.includes(cur_class_info.building)) {
                buf += (no_data + " (no physical location)");
                continue;
            }
            else if (buildings_blacklist.includes(cur_class_info.building)) {
                buf += (no_data + " (unknown exact location)");
                continue;
            }

            // lookup distance and time based on locations
            let prev_class_idx = buildings_idx.indexOf(prev_class_info.building);
            let cur_class_idx = buildings_idx.indexOf(cur_class_info.building);

            if (prev_class_idx == -1 || cur_class_idx == -1) {
                // ERROR, but we'll handle gracefully instead of throwing an exception
                buf += unknown;
                continue;
            }

            let time_dist_info = td_matrix[prev_class_idx].elements[cur_class_idx];

            // check for off-nominal data (i.e. "NOT_FOUND" in the case of a problematic address input)
            if (time_dist_info.status != "OK") {
                // ERROR, but we'll handle gracefully instead of throwing an exception
                buf += unknown;
                continue;
            }

            // format nominal data
            buf += time_dist_info.distance.text + " (" + time_dist_info.duration.text + ")";
        }
    }

    return buf != "" ? buf : (no_data + " (no days scheduled)");
}


/**
 * Extracts all `classInfo` structs from parsed class information corresponding
 * to a specified course. Additionally includes all `classInfo` structs that
 * correspond to classes immediately preceding classes of interest, as these
 * are also of interest due to our desire to support the time/distance
 * estimation between classes.
 * 
 * @param {Map<String,Array<classInfo>>} ordered_classes - All `classInfo` structs parsed from student's Class Planner, representing a schedule.
 * @param {String} course_department_abbrev - Abbreviation of course's department.
 * @param {String} course_number - Course's number.
 * @returns {Map<String,Array<Array<classInfo>>>}
 */
function getAllCurAndPrevClassInfo(ordered_classes, course_department_abbrev, course_number) {

    // init empty map (will map day --> array of [previous class's info, current class's info])
    let results = new Map();

    // iterate through each day
    for (let [day, classes] of ordered_classes) {

        // get current value for "day" inside of "results" map (if none, then init to empty array)
        let res = results.has(day) ? results.get(day) : [];

        // init previous class to null (handle if specified class lookup is the first in a day)
        let prev_class_info = null;

        // iterate through each class in a day
        for (let cur_class_info of classes) {

            // check if current class is our class of interest (need to push to results)
            if (cur_class_info.name == (course_department_abbrev + " " + course_number)) {
                res.push([prev_class_info, cur_class_info]);
            }

            // update previous_class to prepare for next iteration
            prev_class_info = cur_class_info;
        }

        // add constructed array to final results map
        results.set(day, res);
    }

    // finished, so return constructed map
    return results;
}


/**
 * Helper function to extract only portion of string corresponding to a
 * class's department, removing all course number information.
 * 
 * @param {String} str - Class Record string, containing course number and its department and its number.
 * @returns {String}
 */
function extractDepartmentFromClassRecord(str) {
    return /(?:[^:]*:)?(.*)/.exec(str)[1].trim();
}


/**
 * Helper function to extract only portion of string corresponding to a
 * class's number, removing all course department information.
 * 
 * @param {String} str - Class Record string, containing course number and its department and its number.
 * @returns {String}
 */
function extractNumberFromClassRecord(str) {
    return /^[^-]+/.exec(str)[0].trim();
}


/**
 * Entry point to `timedistance` module, managing all means of computing/estimating time and distance
 * between classes in a user's schedule, as well as injecting this computed data into the user's Class Plan.
 * 
 * Performs call to Distance Matrix API, and routes to other internal handling functions in `timedistance`
 * module.
 * 
 * Currently executed directly by extension's background script.
 * 
 * @returns void
 * 
 * @todo Move Distance Matrix API call to backend, and replace internal corresponding code to backend API call.
 */
function initiateTimeDistance() {

    // parse all class info from webpage
    let class_info = getClassBuildings();

    // Construct unique building addresses by indexing into address table
    let unique_buildings = [];
    for (let building of class_info.get("uniqueBuildings")){
        let val = location_to_address.get(building);
        if(val != null) // only add if not null
            unique_buildings.push(val);
    }

    console.log(unique_buildings);

    let total_buildings = unique_buildings.length;
    let str_addr = "";

    // construct Distance Matrix API call URL
    if (total_buildings > 0) {

        console.log(unique_buildings[0]);

        // %7C is '|' and %2C is ','
        str_addr += unique_buildings[0];
        for (let i = 1; i < total_buildings; i++) {
            str_addr += "%7C";
            str_addr += unique_buildings[i];
        }
    }

    console.log(str_addr);

    /* compute time/distance between locations by invoking Distance Matrix API (only enabled in "Developer" mode for now to avoid excessive API calls while in development) */
    
    // determine what unit to represent distance in
    chrome.storage.sync.get("units_imperial", ({ units_imperial }) => {
        
        let str_units = "";

        // check if imperial units preferred
        if (units_imperial) {
            str_units = "&units=imperial";
        }
        else {
            str_units = ""; // default is metric, so leave as is
        }

        // determine what mode of transportation we should use for estimates
        chrome.storage.sync.get("use_biking_time", ({ use_biking_time }) => {

            let str_mode = "";
            
            // check if biking time estimates are preferred
            if (use_biking_time) {
                str_mode = "&mode=biking";
            }
            else {
                str_mode = "&mode=walking";
            }

            // TODO: Invoke backend API to perform this call, which would passthrough response back to us (helps hide API key, and IH principle)
            var map_url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + str_addr + "&" + "destinations=" + str_addr + str_units + str_mode + "&key=" + MAP_API_KEY;

            // determine if we should perform API call
            chrome.storage.sync.get("dev_mode", ({ dev_mode }) => {

                // check if we're in "Developer" mode
                if (dev_mode) {

                    console.log("Peforming Distance Matrix API call... (developer mode ENABLED)");

                    // Perform API call
                    chrome.runtime.sendMessage({
                        url: map_url,
                        contentScriptQuery: "getTimeDistanceData"
                    }
                        , response => {
                            populateTimeDistance(response, class_info);
                        }
                    );
                }
                else { // Don't perform API call, and inject placeholder (i.e. "N/A (disabled)")
                    console.log("Avoiding Distance Matrix API call (developer mode DISABLED)");
                    populateTimeDistance(null, class_info);
                }
            })
        })
    });
}


/**
 * classInfo: Holds all relevant information for a specific section's class.
 * 
 * @constructor
 * @param {String} name - Corresponding course name for class
 * @param {String} section - Section name/type (i.e. "Lab 1A" or "Lec 2")
 * @param {String} building - Building and/or location of class
 * 
 * @todo Rename to reflect original design to distinguish between class, section, and course.
 */
function classInfo(name, section, building) {
    this.name = name;
    this.section = section;
    this.building = building;
};


/**
 * Performs parsing of user's Class Planner, constructing a schedule represented
 * by various mappings of `classInfo` structs.
 * 
 * @returns {Map<String, Object>} 1st element: A mapping from
 * day of week to an ordered list
 * of buildings that the student must visit for that day.
 * 2nd element: A set of all distinct buildings students
 * will visit.
 * 
 * @todo Rename various data structures to utilize term "schedule".
 */
function getClassBuildings() {
    const result = new Map();
    const ordered_classes = new Map();
    const week_boxes = document.getElementsByClassName('timebox');
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const unique_buildings = new Set();
    let i = 0;

    for (const day_boxes of week_boxes) {
        let class_boxes = day_boxes.getElementsByClassName('planneritembox');
        let classArr = [];
        for(const class_box of class_boxes){
            let class_info = class_box.innerText.split("\n");
            if(class_info.length != 3){
                console.log("Error: Parsed class info is not length 3.");
            }
            let name = class_info[0];
            let section = class_info[1];
            let place = class_info[2];
            let building = extractBuilding(place);
            classArr.push(new classInfo(name, section, building));
            unique_buildings.add(building);
        }
        ordered_classes.set(day[i], classArr);
        i++;
    }

    generateMapID(ordered_classes);
    result.set("orderedClasses", ordered_classes);
    result.set("uniqueBuildings", unique_buildings);
    console.log(result);
    return result;
}


/**
 * Helper function for extracting only building from class location string,
 * removing any notion of room number.
 * 
 * @param {String} place
 * @returns {String}
 */
function extractBuilding(place) {

    // remove any trailing/leading whitespace
    let trimmed_place = place.trim();

    // handle special cases
    let special_cases_prefixes = ["700 Westwood Plaza", "Lab School 1", "Medical Plaza 100", "Medical Plaza 200", "Medical Plaza 300", "1010 Westwood Center"];
    for (const prefix in special_cases_prefixes) {
        if (trimmed_place.startsWith(prefix)) {
            return prefix;
        }
    }

    // if not special case, then general case
    let words = trimmed_place.split(" "); // split into words
    if (hasNumber(words.at(-1))) { // if the last word has any amount of numbers, we assume it's a room number (want to remove)
        return words.slice(0,words.length - 1).join(" ").trim();
    }
    else // no modification needed
        return trimmed_place;
}


/**
 * Helper function for determining if there is a number present in the input
 * string.
 * 
 * @param {String} str 
 * @returns {Boolean}
 */
function hasNumber(str) {
    return /\d/.test(str);
}

/**
 * Generates a Map ID that'll be copied by the user to create a 3D map of their schedule. 
 * @param {Object} ordered_classes 
 * @returns {void}
 */
function generateMapID(ordered_classes) {
    let ordered_locations = {};
    ordered_classes.forEach((value, key) => {
        let class_coords = [];
        value.forEach(class_info => {
            let class_coord = location_to_coords.get(class_info.building);
            if (class_coord != null) {
                let lnglat = { lat: class_coord.lat, lng: class_coord.lng };
                class_coords.push(lnglat);
            }
        })
        ordered_locations[key] = class_coords;
    })
    console.log("ordered locations string:");

    let json_str = JSON.stringify(ordered_locations);

    const encode_map_num = {
        '1': '!',
        '2': '@',
        '3': '#',
        '4': '$',
        '5': '%',
        '6': '^',
        '7': '&',
        '8': '*',
        '9': '(',
        '0': ')'
    }
    
    let map_id_special = "";

    for(let i = 0; i < json_str.length; i++){
        let curr_char = json_str.charAt(i);
        if(curr_char in encode_map_num)
            map_id_special += encode_map_num[curr_char];
        else 
            map_id_special += curr_char;
    }
    
    let map_id = "";
    for(let i = map_id_special.length-1; i >= 0; i--)
        map_id += map_id_special[i];

    console.log(map_id);

    let storage = chrome.storage.local;
    let obj = {'id':map_id};

    storage.set({'mapID': obj}, function() {
        console.log('Value is set to ' + map_id);
    });
   

    storage.get(['mapID'], function(result) {
        console.log(result);
      });
}
// Kick-off time/distance computation and injection
// initiateTimeDistance();