export type ItineraryDay={day:string;title:string;details:string;stay?:string;meals?:string};
export type ItineraryProfile={
  days:ItineraryDay[];
  pace:string;
  bestTime:string;
  included:string[];
  excluded:string[];
  tips:string[];
};

type PackageLike={slug:string;name:string;duration:string;route:string;from:string;category:string;meals?:string};

const day=(n:number,title:string,details:string,stay?:string,meals="Breakfast / Dinner"):ItineraryDay=>({day:`Day ${String(n).padStart(2,"0")}`,title,details,stay,meals});

const profiles:Record<string,ItineraryProfile>={
  "char-dham":{
    pace:"Demanding pilgrimage • High walking • Mountain roads",
    bestTime:"May–June and September–October",
    days:[
      day(1,"Delhi / Haridwar arrival","Pickup from the confirmed railway station, airport or hotel and transfer to Haridwar. Visit Har Ki Pauri and attend Ganga Aarti when timing permits.","Haridwar"),
      day(2,"Haridwar → Barkot","Drive through the Himalayan foothills towards Barkot. En-route sightseeing around Mussoorie / Kempty Falls can be added subject to road and timing conditions.","Barkot"),
      day(3,"Barkot → Janki Chatti → Yamunotri → Barkot","Early transfer to Janki Chatti followed by the Yamunotri pilgrimage by trek, pony, palki or other locally available mode. Return to Barkot after darshan.","Barkot"),
      day(4,"Barkot → Uttarkashi","Drive to Uttarkashi. Visit Kashi Vishwanath Temple and local market if time permits.","Uttarkashi"),
      day(5,"Uttarkashi → Gangotri → Uttarkashi","Proceed to Gangotri for darshan and time near Bhagirathi river. Return to Uttarkashi by evening.","Uttarkashi"),
      day(6,"Uttarkashi → Guptkashi / Sitapur","Long mountain drive towards the Kedarnath sector. Check in and keep the evening relaxed for the next day’s pilgrimage.","Guptkashi / Sitapur"),
      day(7,"Guptkashi → Sonprayag → Kedarnath","Transfer to Sonprayag and continue to Kedarnath by the confirmed local travel / trekking arrangement. Darshan and overnight near the temple sector.","Kedarnath"),
      day(8,"Kedarnath → Sonprayag → Guptkashi","Morning darshan if required, then return from Kedarnath to Sonprayag and continue to Guptkashi / Sitapur.","Guptkashi / Sitapur"),
      day(9,"Guptkashi → Badrinath","Drive through the Alaknanda valley towards Badrinath. Evening Badrinath Temple darshan subject to temple timings.","Badrinath"),
      day(10,"Badrinath → Joshimath → Rishikesh / Haridwar","Complete any pending darshan, then descend towards Rishikesh / Haridwar. Optional Mana Village visit can be added when route and time allow.","Rishikesh / Haridwar"),
      day(11,"Haridwar → Delhi / onward journey","Breakfast and transfer to Delhi railway station, airport or hotel as per the confirmed booking. Tour concludes with On A Trip Holidays support.","—","Breakfast")
    ],
    included:["Accommodation as per confirmed hotel plan","Private / group road transport as booked","Breakfast and dinner where selected","Travel coordination and on-tour assistance","Pilgrimage route guidance"],
    excluded:["Helicopter, pony, palki and local union charges unless specifically mentioned","Temple special-entry tickets unless included in the voucher","Personal expenses, laundry and tips","Train / flight tickets unless specifically included"],
    tips:["Keep one flexible buffer in the plan for mountain weather and traffic.","Carry warm layers, rain protection and comfortable walking shoes.","For seniors, request a slower pace and suitable stay location before booking."]
  },
  "do-dham":{
    pace:"Demanding pilgrimage • High walking",
    bestTime:"May–June and September–October",
    days:[
      day(1,"Dehradun / Haridwar → Guptkashi","Pickup and scenic drive into the Garhwal Himalayas. Check in and rest.","Guptkashi / Sitapur"),
      day(2,"Guptkashi → Sonprayag → Kedarnath","Proceed to Sonprayag and continue towards Kedarnath using the confirmed local travel / trek arrangement. Darshan and overnight stay.","Kedarnath"),
      day(3,"Kedarnath → Sonprayag → Guptkashi","Complete morning darshan if needed and return to Sonprayag. Continue to Guptkashi / Sitapur.","Guptkashi / Sitapur"),
      day(4,"Guptkashi → Chopta → Badrinath","Drive through Chopta / Joshimath sector towards Badrinath. Optional Tungnath / Chopta experience depends on season, weather and time.","Badrinath"),
      day(5,"Badrinath Darshan + Mana Village","Early Badrinath darshan followed by Mana Village and nearby viewpoints if open and time permits.","Badrinath"),
      day(6,"Badrinath → Rudraprayag / Srinagar","Descend through the Alaknanda valley with scenic stops. Relax after the pilgrimage stretch.","Rudraprayag / Srinagar"),
      day(7,"Rudraprayag → Rishikesh","Continue towards Rishikesh. Evening at leisure around the Ganga ghats.","Rishikesh"),
      day(8,"Rishikesh local → Haridwar","Optional Ram Jhula / Ganga-side sightseeing followed by transfer to Haridwar.","Haridwar"),
      day(9,"Haridwar → Dehradun / onward journey","Breakfast and final transfer to the confirmed departure point.","—","Breakfast")
    ],
    included:["Hotel accommodation as booked","Road transfers as confirmed","Breakfast and dinner where selected","Trip coordination and pilgrimage assistance"],
    excluded:["Pony/palki/helicopter and local transport charges unless listed","Personal expenses and tips","Special darshan tickets unless listed"],
    tips:["Tungnath is weather and season dependent; it should not be promised as a fixed activity in bad weather.","Mountain driving times are indicative, not guaranteed."]
  },
  "kedarnath":{
    pace:"Demanding pilgrimage • High walking",
    bestTime:"May–June and September–October",
    days:[
      day(1,"Haridwar / Dehradun → Guptkashi","Pickup and drive towards Guptkashi / Sitapur with scenic Himalayan stops.","Guptkashi / Sitapur"),
      day(2,"Guptkashi → Sonprayag → Kedarnath","Transfer to Sonprayag and proceed to Kedarnath by the confirmed local mode. Darshan and overnight stay.","Kedarnath"),
      day(3,"Kedarnath Darshan → Sonprayag → Guptkashi","Morning darshan and return journey to Sonprayag, followed by transfer to Guptkashi / Sitapur.","Guptkashi / Sitapur"),
      day(4,"Guptkashi → Rishikesh / Haridwar","Descend through the mountain valleys. Evening Ganga-side leisure depending on arrival time.","Rishikesh / Haridwar"),
      day(5,"Rishikesh / Haridwar local","Optional Ganga Aarti, temple visit or rest day depending on the confirmed route.","Rishikesh / Haridwar"),
      day(6,"Departure","Breakfast and transfer to the railway station, airport or onward destination.","—","Breakfast")
    ],
    included:["Accommodation as confirmed","Road transport as booked","Breakfast and dinner where selected","Travel assistance"],
    excluded:["Kedarnath helicopter / pony / palki unless included","Personal expenses","Special darshan charges unless listed"],
    tips:["Start the pilgrimage early and keep hydration high.","Ask for a senior-friendly plan if required."]
  },
  "manali":{
    pace:"Easy–moderate leisure • Flexible sightseeing",
    bestTime:"March–June and October–February for snow experiences",
    days:[
      day(1,"Delhi → Shimla","Pickup from Delhi and drive to Shimla. Check in and enjoy Mall Road / Ridge area if time permits.","Shimla"),
      day(2,"Shimla local sightseeing","Visit Kufri, Himalayan Nature Park area, Jakhoo Temple and Shimla viewpoints. Evening at leisure.","Shimla"),
      day(3,"Shimla → Manali","Scenic transfer towards Manali via the Beas valley. Check in and relax after the drive.","Manali"),
      day(4,"Manali local + Solang Valley","Explore Hadimba Temple, Manu Temple, Old Manali and Mall Road, followed by Solang Valley subject to road and weather conditions.","Manali"),
      day(5,"Manali → Kasol / Kullu experience","Enjoy Kullu valley and a flexible Kasol / Manikaran excursion depending on the selected package option.","Manali / Kasol"),
      day(6,"Manali → Delhi / onward journey","Breakfast, check-out and departure towards Delhi. Tour ends after arrival / onward transfer.","—","Breakfast")
    ],
    included:["Hotel accommodation as selected","Private vehicle / group transfer","Breakfast and dinner where selected","Local sightseeing as per voucher"],
    excluded:["Adventure activities and entry tickets unless listed","Personal expenses and meals not listed","Peak-season supplements if applicable"],
    tips:["Rohtang / Atal Tunnel access is permit and weather dependent.","Keep one flexible activity window for mountain conditions."]
  },
  "kashmir":{
    pace:"Easy–moderate leisure • Valley sightseeing",
    bestTime:"March–June and September–November; winter for snow experiences",
    days:[
      day(1,"Srinagar arrival + Dal Lake","Airport pickup, hotel / houseboat check-in and evening Shikara experience if selected.","Srinagar"),
      day(2,"Srinagar → Gulmarg → Srinagar","Day trip to Gulmarg with meadow sightseeing and optional Gondola tickets subject to availability and weather.","Srinagar"),
      day(3,"Srinagar → Pahalgam","Drive through scenic countryside to Pahalgam. Explore the valley and local viewpoints according to local vehicle rules.","Pahalgam"),
      day(4,"Pahalgam → Srinagar + local sightseeing","Return to Srinagar and visit Mughal Gardens / Pari Mahal or other attractions based on timing.","Srinagar"),
      day(5,"Srinagar → Sonamarg → Srinagar","Excursion to Sonamarg. Snow-point access is seasonal and subject to local transport / weather conditions.","Srinagar"),
      day(6,"Srinagar departure","Breakfast and airport transfer for onward journey.","—","Breakfast")
    ],
    included:["Accommodation as selected","Private transfers and sightseeing","Breakfast and dinner where selected","Driver / trip coordination"],
    excluded:["Gondola tickets, pony rides and union vehicles unless listed","Personal expenses","Flights / trains unless included"],
    tips:["Gulmarg and Sonamarg activities are highly weather dependent.","Carry a valid photo ID for hotel and transport checks."]
  },
  "ladakh":{
    pace:"Adventure • High altitude • Acclimatisation required",
    bestTime:"May–September, subject to road and pass conditions",
    days:[
      day(1,"Leh arrival + acclimatisation","Airport pickup and hotel check-in. Keep the day light for altitude acclimatisation; optional short market walk only if comfortable.","Leh"),
      day(2,"Leh local acclimatisation tour","Visit Shanti Stupa, Leh Palace and local monasteries with a relaxed schedule.","Leh"),
      day(3,"Leh → Nubra Valley","Cross Khardung La subject to road conditions and continue to Nubra. Visit sand dunes / Hunder area.","Nubra"),
      day(4,"Nubra → Turtuk / Diskit → Nubra","Explore Diskit Monastery and, if selected and permits allow, continue towards Turtuk. Return to Nubra.","Nubra"),
      day(5,"Nubra → Pangong Lake","Drive via Shyok / Chang La route depending on local road conditions. Reach Pangong and enjoy the lake at sunset.","Pangong"),
      day(6,"Pangong → Hanle / Umling La option","For the extended circuit, proceed towards Hanle and Umling La subject to permits, road status and vehicle eligibility. Otherwise return towards Leh.","Hanle / Leh"),
      day(7,"Leh departure","Breakfast and airport transfer. For longer full-circuit versions, additional Manali / Srinagar road days are added.","—","Breakfast")
    ],
    included:["Accommodation as selected","Vehicle and driver for the confirmed circuit","Breakfast and dinner where selected","Route coordination and permit assistance where applicable"],
    excluded:["Inner-line permits unless listed","Adventure activities and personal expenses","Flights / bike rentals unless specifically booked"],
    tips:["Acclimatisation is essential; avoid heavy activity immediately after arrival.","Umling La / Hanle access depends on permits, road conditions and local restrictions."]
  },
  "spiti":{
    pace:"Adventure road trip • Long mountain drives",
    bestTime:"May–October, subject to snowfall and road openings",
    days:[
      day(1,"Delhi → Shimla / Narkanda","Begin the mountain road journey from Delhi and reach the Shimla / Narkanda sector.","Shimla / Narkanda"),
      day(2,"Shimla / Narkanda → Kalpa","Drive through the Kinnaur valley with views of the Sutlej and Kinnaur ranges.","Kalpa"),
      day(3,"Kalpa → Nako → Tabo","Cross high mountain terrain and visit Nako Lake and Tabo monastery area.","Tabo"),
      day(4,"Tabo → Dhankar → Kaza","Visit Dhankar region and continue to Kaza, the main base of Spiti Valley.","Kaza"),
      day(5,"Kaza → Key Monastery → Kibber → Chicham","Explore Key Monastery, Kibber and Chicham Bridge, subject to road conditions.","Kaza"),
      day(6,"Kaza local → Langza → Hikkim → Komic","Visit the high villages of Langza, Hikkim and Komic with time for local culture and mountain views.","Kaza"),
      day(7,"Kaza → Chandratal / Batal sector","Proceed towards the Chandratal side when the road is open. Camp / stay arrangement depends on season and weather.","Chandratal / Batal"),
      day(8,"Chandratal → Manali","Descend towards Manali through the high-altitude route if open and operational.","Manali"),
      day(9,"Manali → Delhi / onward journey","Breakfast and departure towards Delhi, concluding the Spiti circuit.","—","Breakfast")
    ],
    included:["Accommodation / camp stay as selected","Private vehicle for the route","Breakfast and dinner where selected","Driver and route coordination"],
    excluded:["Permits where separately charged","Adventure activities and personal expenses","Roadside meals not listed"],
    tips:["Road conditions can change quickly in Spiti; final route may be reversed.","Carry warm layers even in summer."]
  },
  "kerala":{
    pace:"Easy leisure • Backwaters and hill stations",
    bestTime:"September–March; monsoon for a different Kerala experience",
    days:[
      day(1,"Kochi → Munnar","Airport / railway station pickup and drive to Munnar. Stop at waterfalls and viewpoints en route.","Munnar"),
      day(2,"Munnar sightseeing","Visit tea gardens, Mattupetty Dam, Echo Point and other local attractions depending on opening hours.","Munnar"),
      day(3,"Munnar → Thekkady / Alleppey","Drive through Kerala’s scenic plantations towards the next stay. Optional spice plantation experience.","Thekkady / Alleppey"),
      day(4,"Thekkady → Alleppey houseboat","Proceed to Alleppey and board the selected houseboat for a backwater cruise, subject to package type.","Alleppey"),
      day(5,"Alleppey → Kochi","Disembark and continue to Kochi. Visit Fort Kochi, Chinese fishing nets and local heritage areas.","Kochi"),
      day(6,"Kochi departure","Breakfast and airport / railway station drop.","—","Breakfast")
    ],
    included:["Accommodation as selected","Private vehicle and transfers","Breakfast and dinner where selected","Houseboat when included in the selected plan"],
    excluded:["Activities and entry tickets unless listed","Personal expenses","Flights / trains unless included"],
    tips:["Houseboat schedules depend on operator and weather.","Keep comfortable footwear for Fort Kochi and plantation walks."]
  },
  "sikkim":{
    pace:"Easy–moderate • Mountain sightseeing",
    bestTime:"March–May and October–December",
    days:[
      day(1,"Bagdogra / NJP → Gangtok","Pickup and transfer to Gangtok. Check in and relax.","Gangtok"),
      day(2,"Gangtok local sightseeing","Explore Rumtek / Tsomgo-side options depending on the package, plus MG Marg and local viewpoints.","Gangtok"),
      day(3,"Gangtok → Tsomgo Lake → Nathula option","Travel towards Tsomgo Lake and Baba Mandir; Nathula is permit, weather and opening dependent.","Gangtok"),
      day(4,"Gangtok → Pelling","Scenic transfer towards Pelling with mountain and village landscapes.","Pelling"),
      day(5,"Pelling sightseeing","Visit Pemayangtse Monastery, Rabdentse ruins and viewpoints subject to local conditions.","Pelling"),
      day(6,"Pelling → Darjeeling","Transfer to Darjeeling and enjoy the evening around Mall Road / Chowrasta.","Darjeeling"),
      day(7,"Darjeeling → Bagdogra / NJP","Optional Tiger Hill sunrise subject to weather, followed by breakfast and departure transfer.","—","Breakfast")
    ],
    included:["Accommodation as selected","Transfers and sightseeing vehicle","Breakfast and dinner where selected","Permit coordination where applicable"],
    excluded:["Nathula / permit fees unless listed","Entry tickets and personal expenses","Flights / trains unless included"],
    tips:["Nathula and high-altitude routes can close without notice.","Carry a valid ID for permit processing."]
  },
  "thailand":{
    pace:"Easy leisure • City + beach",
    bestTime:"November–February for generally comfortable weather",
    days:[
      day(1,"India → Bangkok","Arrive in Bangkok, airport pickup and hotel check-in. Evening free for local markets or a dinner cruise option.","Bangkok","Breakfast"),
      day(2,"Bangkok city tour","Explore major city and temple landmarks such as Wat Arun and Wat Pho, followed by shopping / leisure.","Bangkok"),
      day(3,"Bangkok → Pattaya + Coral Island","Transfer to Pattaya and enjoy a Coral Island excursion with optional water activities. Return to Pattaya.","Pattaya"),
      day(4,"Pattaya sightseeing + leisure","Visit selected Pattaya attractions and keep the evening flexible for beach time and shopping.","Pattaya"),
      day(5,"Pattaya → Bangkok departure sector","Transfer back to Bangkok according to the flight schedule. Optional shopping before airport transfer.","—","Breakfast"),
      day(6,"Return to India","International departure / onward journey according to confirmed flight schedule.","—","Breakfast")
    ],
    included:["Hotel accommodation as selected","Airport and intercity transfers as booked","Sightseeing listed in the confirmed package","Breakfast where selected"],
    excluded:["Visa / travel insurance unless listed","Optional activities and personal expenses","Flights unless included"],
    tips:["International flight timings should drive the final Day 1 and departure flow.","Check passport validity and entry requirements before ticketing."]
  },
  "bali":{
    pace:"Easy leisure • Culture + beaches",
    bestTime:"April–October for generally drier weather",
    days:[
      day(1,"Bali arrival → Ubud","Airport pickup, transfer to Ubud and hotel check-in. Evening at leisure.","Ubud","Breakfast"),
      day(2,"Ubud culture and nature","Explore rice terraces, temples and local craft areas. Optional spa / cultural performance.","Ubud"),
      day(3,"Ubud → Kuta / Seminyak","Transfer to the beach area and enjoy sunset / leisure time.","Kuta / Seminyak"),
      day(4,"South Bali sightseeing","Explore Nusa Dua, Uluwatu or another southern Bali route according to the selected package. Sunset experience subject to weather.","Kuta / Seminyak"),
      day(5,"Nusa Penida / leisure option","Take an optional island day trip or keep a relaxed beach and shopping day.","Kuta / Seminyak"),
      day(6,"Bali departure","Breakfast, check-out and airport transfer for the return flight.","—","Breakfast")
    ],
    included:["Accommodation as selected","Airport and local transfers as booked","Sightseeing listed in the package","Breakfast where selected"],
    excluded:["Flights and visa-related charges unless included","Optional water / island activities","Personal expenses"],
    tips:["Boat trips are weather dependent.","Keep some flexibility around traffic-heavy southern Bali routes."]
  },
  "dubai":{
    pace:"Easy city break • Shopping + experiences",
    bestTime:"November–March for comfortable outdoor sightseeing",
    days:[
      day(1,"Dubai arrival + Downtown","Airport transfer, hotel check-in and Dubai Mall / Downtown experience. Burj Khalifa timing as booked.","Dubai","Breakfast"),
      day(2,"Dubai city tour","Explore Palm Jumeirah, Dubai Marina, Jumeirah and major landmarks.","Dubai"),
      day(3,"Desert safari","Morning at leisure followed by afternoon desert safari with dune experience, camp activities and dinner where included.","Dubai"),
      day(4,"Old Dubai + souks","Visit Al Fahidi, Dubai Creek and Gold / Spice Souks. Evening free for shopping or optional cruise.","Dubai"),
      day(5,"Dubai leisure + departure","Free time for shopping / optional attraction followed by airport transfer based on the flight schedule.","—","Breakfast")
    ],
    included:["Accommodation as selected","Airport transfers and listed sightseeing","Desert safari where included","Breakfast where selected"],
    excluded:["Visa and flights unless included","Attraction tickets not listed","Personal expenses"],
    tips:["Reserve popular attraction slots early.","Dress respectfully at religious and heritage sites."]
  },
  "vietnam":{
    pace:"Moderate • City + cruise + beach",
    bestTime:"February–April and September–November, depending on the regions included",
    days:[
      day(1,"Hanoi arrival","Airport pickup, hotel check-in and Old Quarter evening walk.","Hanoi","Breakfast"),
      day(2,"Hanoi city tour","Explore Hoan Kiem Lake, Old Quarter and selected cultural landmarks.","Hanoi"),
      day(3,"Hanoi → Ha Long Bay cruise","Transfer to Ha Long Bay and board the selected cruise. Enjoy limestone karst scenery and onboard activities.","Ha Long Bay cruise"),
      day(4,"Ha Long Bay → Hanoi → Da Nang","Morning cruise activities, disembark and continue to Da Nang by the confirmed flight / transport connection.","Da Nang"),
      day(5,"Da Nang + Hoi An","Explore Da Nang and continue to Hoi An for heritage streets, local markets and evening lantern atmosphere.","Da Nang"),
      day(6,"Da Nang departure","Breakfast and airport transfer for return / onward flight.","—","Breakfast")
    ],
    included:["Hotels / cruise as selected","Transfers and listed sightseeing","Breakfast where selected","On-tour coordination"],
    excluded:["Flights and visa unless included","Optional activities","Personal expenses"],
    tips:["Weather varies significantly between northern and central Vietnam.","Keep flight timings flexible when connecting regions."]
  },
  "nepal":{
    pace:"Moderate • Pilgrimage + mountains",
    bestTime:"March–May and September–November",
    days:[
      day(1,"Kathmandu arrival","Airport pickup and hotel check-in. Evening at leisure.","Kathmandu","Breakfast"),
      day(2,"Kathmandu heritage tour","Visit Pashupatinath, Boudhanath and selected heritage attractions.","Kathmandu"),
      day(3,"Kathmandu → Pokhara","Travel by road or flight as confirmed. Enjoy Lakeside and Phewa Lake in the evening.","Pokhara"),
      day(4,"Pokhara → Muktinath region","Proceed towards the Mustang / Muktinath region by the selected vehicle and route.","Muktinath / Jomsom"),
      day(5,"Muktinath Darshan → Pokhara","Early darshan and return towards Pokhara through the mountain valley.","Pokhara"),
      day(6,"Pokhara sightseeing","Explore Phewa Lake, viewpoints and selected local attractions.","Pokhara"),
      day(7,"Pokhara → Kathmandu","Return by road / flight. Evening shopping or leisure.","Kathmandu"),
      day(8,"Kathmandu departure","Breakfast and airport transfer.","—","Breakfast")
    ],
    included:["Accommodation as selected","Road / flight transfers as booked","Breakfast and dinner where selected","Pilgrimage and travel coordination"],
    excluded:["Flights unless included","Entry tickets and personal expenses","Special temple services unless listed"],
    tips:["Road conditions towards Muktinath can change quickly.","Keep warm layers for the Mustang region."]
  }
};

function daysFromDuration(duration:string){
  const d=duration.match(/(\d+)\s*Days?/i)?.[1];
  if(d)return Math.max(3,Math.min(14,Number(d)));
  const n=duration.match(/(\d+)\s*Nights?/i)?.[1];
  if(n)return Math.max(3,Math.min(14,Number(n)+1));
  return 6;
}

function smartPlaces(item:PackageLike){
  return item.route.split("•").map(x=>x.trim()).filter(Boolean);
}

function buildFallback(item:PackageLike):ItineraryProfile{
  const places=smartPlaces(item);
  const total=daysFromDuration(item.duration);
  const days:ItineraryDay[]=[];
  const category=item.category.toLowerCase();
  const international=category.includes("international");
  for(let i=1;i<=total;i++){
    const current=places[Math.min(i-1,Math.max(0,places.length-1))]||item.from;
    const next=places[Math.min(i,Math.max(0,places.length-1))];
    if(i===1){
      days.push(day(i,`${current} arrival / journey start`,`Begin the ${item.name} journey from ${item.from}. Complete arrival or pickup formalities, check in and keep the first evening light for local orientation and rest.`,current,international?"Breakfast":(item.meals||"Breakfast / Dinner")));
    }else if(i===total){
      days.push(day(i,`${current} → departure / onward journey`,`Breakfast and check-out. Complete any short final sightseeing that fits the confirmed transport schedule, then transfer to the departure point. The route can be adjusted for your actual flight / train timing.`,"—","Breakfast"));
    }else{
      const activity=category.includes("pilgrimage")?`Visit the important temples / pilgrimage points around ${current}, keeping darshan timing and local access rules in mind.`:category.includes("adventure")?`Explore ${current} and continue towards ${next||"the next stop"}. Expect scenic drives, local viewpoints and weather-dependent activities.`:`Explore the key attractions around ${current}, then continue towards ${next||"the next stop"} according to the confirmed route.`;
      days.push(day(i,`${current}${next?` → ${next}`:" sightseeing"}`,activity,current,item.meals||"Breakfast / Dinner"));
    }
  }
  const included=international?["Accommodation as selected","Airport / intercity transfers listed in the package","Sightseeing and experiences listed in the confirmed plan","Breakfast where selected"]:["Accommodation as selected","Vehicle / transfers as booked","Sightseeing listed in the confirmed itinerary","Breakfast and dinner where selected"];
  const excluded=international?["Flights, visa and insurance unless specifically included","Optional activities and attraction tickets not listed","Personal expenses and meals not listed"]:["Entry tickets, permits and local activity charges unless listed","Personal expenses, tips and meals not listed","Weather / route-related extra costs where applicable"];
  return {days,pace:category.includes("adventure")?"Adventure • Active travel • Conditions dependent":category.includes("pilgrimage")?"Pilgrimage • Moderate to demanding":"Leisure • Flexible sightseeing",bestTime:international?"Best season varies by destination; confirm dates before booking":"Best season varies by destination and local weather",included,excluded,tips:["Final route order, hotel names and travel times are confirmed on the booking voucher.","Road / weather conditions may change sightseeing order without reducing the core trip experience.","Ask the team for a private, family, senior-friendly or Telugu-group version."]};
}

export function getItineraryProfile(item:PackageLike):ItineraryProfile{return profiles[item.slug]||buildFallback(item)}
