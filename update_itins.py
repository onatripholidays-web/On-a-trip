from pathlib import Path
import re

base=Path('/mnt/data/v27work')

ITINS={
'package-ladakh.html': [
('Day 01','Arrival in Leh • Acclimatisation','Pickup from Leh Airport and transfer to hotel. Rest and acclimatise to the high altitude. Evening at Leh Market if comfortable.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 02','Leh Local + Sham Valley','Visit Hall of Fame, Gurudwara Pathar Sahib, Magnetic Hill and Sangam. Return to Leh for rest.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 03','Leh → Khardung La → Nubra','Drive over Khardung La towards Nubra Valley. Visit Diskit Monastery and Hunder sand dunes; optional camel ride subject to local conditions.','Nubra','Camp / Hotel in Nubra','Breakfast / Dinner'),
('Day 04','Nubra → Turtuk → Nubra','Excursion to Turtuk, a scenic Balti village close to the northern frontier. Return to Nubra by evening.','Nubra','Camp / Hotel in Nubra','Breakfast / Dinner'),
('Day 05','Nubra → Pangong Lake','Travel via the Shyok route to Pangong Tso. Enjoy the changing colours of the lake and sunset.','Pangong','Camp in Pangong','Breakfast / Dinner'),
('Day 06','Pangong → Chang La → Leh','Drive back to Leh via Chang La. Evening free for shopping and leisure.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 07','Departure from Leh','Pickup from hotel and transfer to Leh Airport for onward journey.','Leh Airport','—','Breakfast')],
'package-ladakh-tso.html': [
('Day 01','Arrival in Leh • Acclimatisation','Airport pickup, hotel check-in and complete rest for acclimatisation.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 02','Leh Local Sightseeing','Visit Shanti Stupa, Leh Palace, Hall of Fame and Leh Market depending on energy and local conditions.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 03','Leh → Nubra Valley','Drive via Khardung La. Visit Diskit and Hunder.','Nubra','Hotel / Camp','Breakfast / Dinner'),
('Day 04','Nubra → Turtuk → Nubra','Full-day Turtuk excursion with village walk and local culture experience.','Nubra','Hotel / Camp','Breakfast / Dinner'),
('Day 05','Nubra → Pangong','Drive through the Shyok Valley to Pangong Tso. Sunset by the lake.','Pangong','Camp','Breakfast / Dinner'),
('Day 06','Pangong → Leh','Return via Chang La and reach Leh by evening.','Leh','Hotel in Leh','Breakfast / Dinner'),
('Day 07','Leh → Tso Moriri','Long scenic drive towards Tso Moriri through the Changthang region.','Tso Moriri','Camp / Guesthouse','Breakfast / Dinner'),
('Day 08','Tso Moriri → Hanle / Changthang route','Explore the high-altitude lake region and continue as per road and permit conditions.','Hanle / Tso Moriri region','Camp / Guesthouse','Breakfast / Dinner'),
('Day 09','Return / Departure','Transfer towards Leh or onward exit point as per the confirmed package routing.','Leh / Exit point','—','Breakfast')],
'package-char-dham.html': [
('Day 01','Delhi → Haridwar','Pickup from airport/railway station and drive to Haridwar. Evening Ganga Aarti, subject to timing.','Haridwar','Hotel in Haridwar','Dinner'),
('Day 02','Haridwar → Barkot','Proceed towards Barkot via Mussoorie route. Check-in and rest.','Barkot','Hotel in Barkot','Breakfast / Dinner'),
('Day 03','Barkot → Janki Chatti → Yamunotri → Barkot','Drive to Janki Chatti, trek/pony/palki options to Yamunotri, darshan and return.','Barkot','Hotel in Barkot','Breakfast / Dinner'),
('Day 04','Barkot → Uttarkashi','Drive to Uttarkashi and visit Kashi Vishwanath Temple if time permits.','Uttarkashi','Hotel in Uttarkashi','Breakfast / Dinner'),
('Day 05','Uttarkashi → Gangotri → Uttarkashi','Excursion to Gangotri for temple darshan and Bhagirathi river views. Return to Uttarkashi.','Uttarkashi','Hotel in Uttarkashi','Breakfast / Dinner'),
('Day 06','Uttarkashi → Guptkashi / Phata','Long drive towards the Kedarnath sector. Check-in and prepare for the next day.','Guptkashi / Phata','Hotel / Guesthouse','Breakfast / Dinner'),
('Day 07','Guptkashi / Phata → Sonprayag → Kedarnath','Transfer to Sonprayag and proceed by approved local transport/trek/heli option as booked. Kedarnath darshan and overnight stay.','Kedarnath','Guesthouse / Camp','Breakfast / Dinner'),
('Day 08','Kedarnath → Sonprayag → Guptkashi','Return journey from Kedarnath to Sonprayag and transfer to hotel.','Guptkashi','Hotel','Breakfast / Dinner'),
('Day 09','Guptkashi → Badrinath','Drive to Badrinath via Joshimath. Evening temple darshan subject to temple timings.','Badrinath','Hotel in Badrinath','Breakfast / Dinner'),
('Day 10','Badrinath → Joshimath / Rudraprayag sector','Morning darshan and proceed towards the lower Himalayan sector.','Rudraprayag / nearby','Hotel','Breakfast / Dinner'),
('Day 11','Return to Haridwar / Delhi sector','Complete the return transfer as per the confirmed route and drop at the designated point.','Haridwar / Delhi','—','Breakfast')],
'package-do-dham.html': [
('Day 01','Dehradun → Guptkashi','Pickup from Dehradun and drive towards Guptkashi.','Guptkashi','Hotel','Breakfast / Dinner'),
('Day 02','Guptkashi → Sonprayag → Kedarnath','Transfer to Sonprayag and proceed to Kedarnath by the booked mode. Darshan and overnight stay.','Kedarnath','Guesthouse / Camp','Breakfast / Dinner'),
('Day 03','Kedarnath → Sonprayag → Guptkashi','Return from Kedarnath and transfer to Guptkashi.','Guptkashi','Hotel','Breakfast / Dinner'),
('Day 04','Guptkashi → Badrinath','Drive through scenic Garhwal roads to Badrinath.','Badrinath','Hotel','Breakfast / Dinner'),
('Day 05','Badrinath Darshan → Joshimath','Morning darshan, Mana Village visit if open and time permits, then proceed to Joshimath.','Joshimath','Hotel','Breakfast / Dinner'),
('Day 06','Joshimath → Chopta','Drive to Chopta and enjoy the mountain surroundings.','Chopta','Hotel / Camp','Breakfast / Dinner'),
('Day 07','Tungnath + Chandrashila','Early start for Tungnath trek; continue to Chandrashila subject to weather and fitness. Return to Chopta.','Chopta','Hotel / Camp','Breakfast / Dinner'),
('Day 08','Chopta → Rishikesh / Dehradun sector','Drive towards Rishikesh with a short stop depending on route.','Rishikesh / Dehradun','Hotel','Breakfast / Dinner'),
('Day 09','Departure','Drop at Dehradun railway station / airport as per the confirmed schedule.','Dehradun','—','Breakfast')],
'package-kedarnath.html': [
('Day 01','Haridwar / Dehradun → Guptkashi','Pickup and scenic drive towards Guptkashi.','Guptkashi','Hotel','Breakfast / Dinner'),
('Day 02','Guptkashi → Sonprayag → Kedarnath','Proceed to Sonprayag and onward to Kedarnath by the selected mode.','Kedarnath','Guesthouse / Camp','Breakfast / Dinner'),
('Day 03','Kedarnath Darshan → Return','Morning temple darshan and begin return towards Sonprayag.','Sonprayag / Guptkashi','Hotel','Breakfast / Dinner'),
('Day 04','Guptkashi → Rishikesh','Drive to Rishikesh. Evening Ganga Aarti if timing permits.','Rishikesh','Hotel','Breakfast / Dinner'),
('Day 05','Rishikesh → Haridwar','Local sightseeing / leisure and transfer to Haridwar.','Haridwar','Hotel','Breakfast / Dinner'),
('Day 06','Departure','Drop at railway station / airport as per the confirmed plan.','Haridwar / Dehradun','—','Breakfast')],
'package-amarnath.html': [
('Day 01','Arrival Srinagar → Pahalgam','Pickup from Srinagar Airport/railway station and transfer to Pahalgam.','Pahalgam','Hotel','Dinner'),
('Day 02','Pahalgam → Baltal / Amarnath sector','Proceed according to the confirmed yatra route and registration slot.','Baltal / Sonamarg sector','Hotel / Camp','Breakfast / Dinner'),
('Day 03','Amarnath Darshan','Yatra by the booked route/mode, subject to weather, permits and local administration. Return to base.','Baltal / Pahalgam sector','Hotel','Breakfast / Dinner'),
('Day 04','Return to Srinagar','Drive back to Srinagar and enjoy leisure time / local market.','Srinagar','Hotel','Breakfast / Dinner'),
('Day 05','Departure','Airport / railway station drop.','Srinagar','—','Breakfast')],
'package-vaishno-devi.html': [
('Day 01','Jammu → Katra','Pickup from Jammu Airport/Railway Station and transfer to Katra. Evening rest and yatra preparation.','Katra','Hotel','Dinner'),
('Day 02','Vaishno Devi Yatra','Proceed to Banganga and begin the pilgrimage to Mata Vaishno Devi Bhawan. Return to Katra after darshan.','Katra','Hotel','Breakfast / Dinner'),
('Day 03','Katra → Patnitop Excursion','Drive to Patnitop for scenic views and leisure. Return to Katra.','Katra','Hotel','Breakfast / Dinner'),
('Day 04','Departure','Transfer to Jammu Airport/Railway Station.','Jammu','—','Breakfast')],
'package-ujjain.html': [
('Day 01','Arrival Ujjain','Pickup from railway station/airport and hotel check-in. Evening Mahakaleshwar area visit.','Ujjain','Hotel','Dinner'),
('Day 02','Mahakaleshwar Darshan + Ujjain','Early temple darshan as per booking/slot, followed by Kal Bhairav, Harsiddhi and Ram Ghat depending on timing.','Ujjain','Hotel','Breakfast / Dinner'),
('Day 03','Ujjain → Omkareshwar → Ujjain','Day excursion to Omkareshwar Jyotirlinga and return to Ujjain.','Ujjain','Hotel','Breakfast / Dinner'),
('Day 04','Departure','Drop at Ujjain / Indore as per the confirmed package.','Ujjain / Indore','—','Breakfast')],
'package-manali.html': [
('Day 01','Delhi / Chandigarh → Manali','Pickup and scenic transfer to Manali. Hotel check-in and leisure.','Manali','Hotel','Dinner'),
('Day 02','Manali Local Sightseeing','Visit Hadimba Temple, Vashisht, Manu Temple, Mall Road and local attractions.','Manali','Hotel','Breakfast / Dinner'),
('Day 03','Solang Valley + Atal Tunnel','Drive to Solang Valley and Atal Tunnel route, subject to weather and road conditions.','Manali','Hotel','Breakfast / Dinner'),
('Day 04','Manali Leisure / Optional Activities','Free day for café hopping, shopping or optional adventure activities.','Manali','Hotel','Breakfast / Dinner'),
('Day 05','Departure','Transfer to the designated pickup/drop point.','Delhi / Chandigarh','—','Breakfast')],
'package-shimla-manali.html': [
('Day 01','Delhi → Shimla','Pickup and drive to Shimla. Check-in and evening Mall Road walk.','Shimla','Hotel','Dinner'),
('Day 02','Shimla + Kufri','Kufri excursion, Himalayan Nature Park area, Jakhoo Temple and Mall Road.','Shimla','Hotel','Breakfast / Dinner'),
('Day 03','Shimla → Manali','Long scenic drive to Manali via mountain valleys.','Manali','Hotel','Breakfast / Dinner'),
('Day 04','Manali Local','Hadimba Temple, Vashisht, Manu Temple, Mall Road and nearby sights.','Manali','Hotel','Breakfast / Dinner'),
('Day 05','Solang + Atal Tunnel','Excursion towards Solang Valley and Atal Tunnel, subject to conditions.','Manali','Hotel','Breakfast / Dinner'),
('Day 06','Manali Leisure','Free time for shopping or optional activities.','Manali','Hotel','Breakfast / Dinner'),
('Day 07','Departure','Drop for onward journey.','Delhi / Chandigarh','—','Breakfast')],
'package-shimla-manali-kasol.html': [
('Day 01','Delhi → Shimla','Pickup and transfer to Shimla.','Shimla','Hotel','Dinner'),
('Day 02','Shimla + Kufri','Kufri, Jakhoo Temple and Mall Road.','Shimla','Hotel','Breakfast / Dinner'),
('Day 03','Shimla → Manali','Scenic drive to Manali.','Manali','Hotel','Breakfast / Dinner'),
('Day 04','Manali Local','Hadimba, Vashisht, Manu Temple and Mall Road.','Manali','Hotel','Breakfast / Dinner'),
('Day 05','Solang Valley + Atal Tunnel','Mountain excursion and optional snow/adventure activities depending on season.','Manali','Hotel','Breakfast / Dinner'),
('Day 06','Manali → Kasol','Drive to Kasol and explore the riverside village/cafés.','Kasol','Hotel / Camp','Breakfast / Dinner'),
('Day 07','Kasol → Manikaran → Kasol','Visit Manikaran Sahib and hot springs, then return.','Kasol','Hotel / Camp','Breakfast / Dinner'),
('Day 08','Departure','Drop towards the confirmed exit point.','Chandigarh / Delhi','—','Breakfast')],
'package-spiti.html': [
('Day 01','Shimla → Narkanda / Sarahan','Pickup and start the Himalayan circuit. Overnight in the selected transit town.','Narkanda / Sarahan','Hotel','Dinner'),
('Day 02','Sarahan → Sangla / Chitkul','Drive through Kinnaur Valley towards Sangla and Chitkul, subject to road conditions.','Sangla','Hotel','Breakfast / Dinner'),
('Day 03','Sangla → Kalpa','Explore the Kinnaur landscape and continue to Kalpa.','Kalpa','Hotel','Breakfast / Dinner'),
('Day 04','Kalpa → Nako → Tabo','Cross into the high-altitude Spiti region via Nako. Continue to Tabo.','Tabo','Hotel / Guesthouse','Breakfast / Dinner'),
('Day 05','Tabo → Dhankar → Kaza','Visit Dhankar region and continue to Kaza.','Kaza','Hotel','Breakfast / Dinner'),
('Day 06','Kaza → Key → Kibber → Chicham','Visit Key Monastery, Kibber and Chicham Bridge area.','Kaza','Hotel','Breakfast / Dinner'),
('Day 07','Kaza → Langza → Hikkim → Komic','Explore high villages and Himalayan landscapes.','Kaza','Hotel','Breakfast / Dinner'),
('Day 08','Kaza → Chandratal / Batal sector','Proceed towards Chandratal subject to road opening and weather.','Chandratal / Camp','Camp','Breakfast / Dinner'),
('Day 09','Chandratal → Atal Tunnel → Manali','Drive back through the Lahaul valley and Atal Tunnel.','Manali','Hotel','Breakfast / Dinner'),
('Day 10','Manali Leisure','Local sightseeing or rest after the long mountain circuit.','Manali','Hotel','Breakfast / Dinner'),
('Day 11','Departure','Drop at the designated exit point.','Chandigarh / Delhi','—','Breakfast')],
'package-spiti-manali.html': [
('Day 01','Manali Arrival','Pickup from Manali bus stand / hotel and check-in.','Manali','Hotel','Dinner'),
('Day 02','Manali → Atal Tunnel → Koksar / Tabo sector','Drive into Lahaul and continue towards Spiti as road conditions permit.','Kunzum / Tabo sector','Hotel / Guesthouse','Breakfast / Dinner'),
('Day 03','Tabo → Dhankar → Kaza','Visit Tabo and Dhankar areas before reaching Kaza.','Kaza','Hotel','Breakfast / Dinner'),
('Day 04','Kaza → Key → Kibber → Chicham','Monastery and high-village sightseeing.','Kaza','Hotel','Breakfast / Dinner'),
('Day 05','Kaza → Langza → Hikkim → Komic','High-altitude village circuit.','Kaza','Hotel','Breakfast / Dinner'),
('Day 06','Kaza → Chandratal','Drive towards Chandratal, subject to route/weather.','Chandratal','Camp','Breakfast / Dinner'),
('Day 07','Chandratal → Manali','Return via Kunzum and Atal Tunnel to Manali.','Manali','Hotel','Breakfast / Dinner'),
('Day 08','Departure','Drop at Manali bus stand / onward transfer point.','Manali','—','Breakfast')],
'package-kashmir.html': [
('Day 01','Arrival Srinagar','Airport pickup, hotel/houseboat check-in and evening leisure.','Srinagar','Hotel / Houseboat','Dinner'),
('Day 02','Srinagar Local','Mughal Gardens, Dal Lake area, Shankaracharya viewpoint if open and local market.','Srinagar','Hotel / Houseboat','Breakfast / Dinner'),
('Day 03','Srinagar → Gulmarg → Srinagar','Full-day Gulmarg excursion. Gondola tickets are optional and subject to availability.','Srinagar','Hotel / Houseboat','Breakfast / Dinner'),
('Day 04','Srinagar → Pahalgam','Drive to Pahalgam via scenic countryside. Optional local sightseeing.','Pahalgam','Hotel','Breakfast / Dinner'),
('Day 05','Pahalgam → Sonamarg / Srinagar','Proceed for Sonamarg excursion subject to route and season, then return to Srinagar.','Srinagar','Hotel / Houseboat','Breakfast / Dinner'),
('Day 06','Departure','Airport drop.','Srinagar','—','Breakfast')],
'package-kashmir-deluxe.html': [
('Day 01','Arrival Srinagar','Airport pickup and check-in. Evening Shikara ride can be added subject to weather.','Srinagar','Deluxe Hotel / Houseboat','Dinner'),
('Day 02','Srinagar → Gulmarg','Gulmarg sightseeing and optional Gondola. Overnight in Gulmarg or Srinagar as booked.','Gulmarg / Srinagar','Hotel','Breakfast / Dinner'),
('Day 03','Gulmarg → Pahalgam','Drive to Pahalgam and explore the valley.','Pahalgam','Hotel','Breakfast / Dinner'),
('Day 04','Pahalgam Local','Explore Betaab Valley / Aru / Chandanwari according to local union rules and season.','Pahalgam','Hotel','Breakfast / Dinner'),
('Day 05','Pahalgam → Sonamarg → Srinagar','Scenic transfer with Sonamarg stop subject to route conditions.','Srinagar','Hotel / Houseboat','Breakfast / Dinner'),
('Day 06','Srinagar Local','Mughal Gardens, Dal Lake and shopping.','Srinagar','Hotel / Houseboat','Breakfast / Dinner'),
('Day 07','Departure','Airport drop.','Srinagar','—','Breakfast')],
'package-kerala.html': [
('Day 01','Arrival Kochi → Munnar','Airport/railway station pickup and drive to Munnar.','Munnar','Hotel','Dinner'),
('Day 02','Munnar Sightseeing','Tea gardens, Mattupetty Dam, Echo Point and photo stops.','Munnar','Hotel','Breakfast / Dinner'),
('Day 03','Munnar → Thekkady','Drive to Thekkady. Optional boating subject to tickets and timing.','Thekkady','Hotel','Breakfast / Dinner'),
('Day 04','Thekkady → Alleppey','Proceed to Alleppey and check in to hotel/houseboat as booked.','Alleppey','Hotel / Houseboat','Breakfast / Dinner'),
('Day 05','Alleppey → Kochi','Relaxed morning and transfer to Kochi. Fort Kochi sightseeing if time permits.','Kochi','Hotel','Breakfast / Dinner'),
('Day 06','Departure','Airport/railway station drop.','Kochi','—','Breakfast')],
'package-kerala-couple.html': [
('Day 01','Kochi → Munnar','Private pickup and scenic transfer to Munnar.','Munnar','Premium Hotel','Dinner'),
('Day 02','Munnar Romantic Escape','Tea estates, viewpoints and leisure time. Optional private experiences.','Munnar','Premium Hotel','Breakfast / Dinner'),
('Day 03','Munnar → Thekkady','Transfer to Thekkady with plantation/forest-region stops.','Thekkady','Premium Hotel','Breakfast / Dinner'),
('Day 04','Thekkady → Alleppey','Transfer to Alleppey and check-in to selected stay/houseboat.','Alleppey','Premium Hotel / Houseboat','Breakfast / Dinner'),
('Day 05','Alleppey Leisure → Kochi','Relaxed morning, then transfer to Kochi.','Kochi','Hotel','Breakfast / Dinner'),
('Day 06','Departure','Private airport/railway station drop.','Kochi','—','Breakfast')],
'package-sikkim.html': [
('Day 01','Bagdogra / NJP → Gangtok','Pickup and transfer to Gangtok.','Gangtok','Hotel','Dinner'),
('Day 02','Gangtok Local','Rumtek Monastery, Banjhakri Falls, viewpoints and MG Marg.','Gangtok','Hotel','Breakfast / Dinner'),
('Day 03','Tsomgo Lake + Baba Mandir + Nathula','Excursion subject to permits, weather and army restrictions.','Gangtok','Hotel','Breakfast / Dinner'),
('Day 04','Gangtok Leisure','Free day for local shopping or optional sightseeing.','Gangtok','Hotel','Breakfast / Dinner'),
('Day 05','Gangtok → Bagdogra / NJP','Transfer for onward journey.','Bagdogra / NJP','—','Breakfast'),
('Day 06','Buffer / alternate departure day','Use only where the confirmed package includes an extra night; otherwise departure is Day 05.','As booked','—','Breakfast')],
'package-sikkim-darjeeling.html': [
('Day 01','Bagdogra / NJP → Gangtok','Pickup and transfer to Gangtok.','Gangtok','Hotel','Dinner'),
('Day 02','Gangtok Local','Rumtek, Banjhakri Falls, viewpoints and MG Marg.','Gangtok','Hotel','Breakfast / Dinner'),
('Day 03','Gangtok → Pelling','Scenic transfer to Pelling with stops en route.','Pelling','Hotel','Breakfast / Dinner'),
('Day 04','Pelling Sightseeing → Darjeeling','Visit Pemayangtse / Rabdentse area and continue to Darjeeling.','Darjeeling','Hotel','Breakfast / Dinner'),
('Day 05','Darjeeling Sunrise + Local','Tiger Hill sunrise subject to weather, Batasia Loop, Himalayan Mountaineering Institute and Mall Road.','Darjeeling','Hotel','Breakfast / Dinner'),
('Day 06','Darjeeling → Bagdogra / NJP','Transfer for onward journey.','Bagdogra / NJP','—','Breakfast'),
('Day 07','Departure buffer','Only applicable where the confirmed booking includes the extra night.','As booked','—','Breakfast')],
'package-nepal.html': [
('Day 01','Arrival Kathmandu','Airport pickup, hotel check-in and evening leisure.','Kathmandu','Hotel','Dinner'),
('Day 02','Kathmandu Heritage Tour','Pashupatinath, Boudhanath, Swayambhunath and Kathmandu Durbar Square subject to entry/timing.','Kathmandu','Hotel','Breakfast / Dinner'),
('Day 03','Kathmandu → Pokhara','Scenic road transfer to Pokhara. Evening lakeside walk.','Pokhara','Hotel','Breakfast / Dinner'),
('Day 04','Pokhara Sightseeing','Sarangkot sunrise subject to weather, Devi’s Fall, Gupteshwor Cave and Phewa Lake area.','Pokhara','Hotel','Breakfast / Dinner'),
('Day 05','Pokhara → Chitwan','Transfer to Chitwan and evening cultural programme where available.','Chitwan','Resort','Breakfast / Dinner'),
('Day 06','Chitwan Jungle Activities','Jungle activities according to park rules and seasonal availability.','Chitwan','Resort','Breakfast / Dinner'),
('Day 07','Chitwan → Kathmandu','Return to Kathmandu. Evening shopping/free time.','Kathmandu','Hotel','Breakfast / Dinner'),
('Day 08','Departure','Airport drop.','Kathmandu','—','Breakfast')],
'package-rajasthan.html': [
('Day 01','Arrival Jaipur','Pickup and hotel check-in. Evening local market.','Jaipur','Hotel','Dinner'),
('Day 02','Jaipur Sightseeing','Amber Fort, City Palace, Hawa Mahal, Jantar Mantar and local bazaar.','Jaipur','Hotel','Breakfast / Dinner'),
('Day 03','Jaipur → Jodhpur','Drive to Jodhpur and evening leisure.','Jodhpur','Hotel','Breakfast / Dinner'),
('Day 04','Jodhpur Sightseeing','Mehrangarh Fort, Jaswant Thada, Clock Tower market and blue-city lanes.','Jodhpur','Hotel','Breakfast / Dinner'),
('Day 05','Jodhpur → Jaisalmer','Transfer to Jaisalmer. Sunset at Sam / desert area if time permits.','Jaisalmer','Hotel / Camp','Breakfast / Dinner'),
('Day 06','Jaisalmer Sightseeing + Desert','Jaisalmer Fort, Patwon Ki Haveli, Gadisar Lake and desert experience.','Jaisalmer','Hotel / Camp','Breakfast / Dinner'),
('Day 07','Departure','Drop at Jaisalmer / Jodhpur as per confirmed plan.','Jaisalmer / Jodhpur','—','Breakfast')],
'package-gujarat.html': [
('Day 01','Arrival Ahmedabad','Pickup and local sightseeing depending on arrival time.','Ahmedabad','Hotel','Dinner'),
('Day 02','Ahmedabad → Dwarka','Drive to Dwarka. Evening temple visit subject to darshan timings.','Dwarka','Hotel','Breakfast / Dinner'),
('Day 03','Dwarka + Bet Dwarka','Visit Dwarkadhish Temple and nearby pilgrimage sites; Bet Dwarka subject to local access.','Dwarka','Hotel','Breakfast / Dinner'),
('Day 04','Dwarka → Somnath','Drive to Somnath. Evening temple / light-and-sound programme if operating.','Somnath','Hotel','Breakfast / Dinner'),
('Day 05','Somnath → Ahmedabad sector','Proceed via selected route with sightseeing stops as time permits.','Ahmedabad / Vadodara','Hotel','Breakfast / Dinner'),
('Day 06','Statue of Unity Excursion','Visit Ekta Nagar and Statue of Unity complex according to ticket availability.','Vadodara / Ahmedabad','Hotel','Breakfast / Dinner'),
('Day 07','Departure','Airport / railway station drop.','Ahmedabad','—','Breakfast')],
'package-gokarna-dandeli.html': [
('Day 01','Arrival Gokarna','Pickup and check-in. Visit Gokarna beach/temple area in the evening.','Gokarna','Hotel','Dinner'),
('Day 02','Gokarna Beach Circuit','Explore Om Beach, Kudle Beach and nearby viewpoints.','Gokarna','Hotel','Breakfast / Dinner'),
('Day 03','Gokarna → Dandeli','Transfer to Dandeli and check-in. Optional evening activity.','Dandeli','Resort','Breakfast / Dinner'),
('Day 04','Dandeli Adventure Day','River rafting / kayaking / jungle activities subject to season, river flow and operator availability.','Dandeli','Resort','Breakfast / Dinner'),
('Day 05','Dandeli → Murudeshwar / Departure','Visit Murudeshwar on the return route if timings permit, then onward drop.','Murudeshwar / Exit point','—','Breakfast')],
'package-thailand.html': [
('Day 01','Arrival Bangkok → Pattaya','Airport pickup and transfer to Pattaya. Hotel check-in and leisure.','Pattaya','Hotel','Dinner'),
('Day 02','Coral Island Tour','Speedboat transfer to Coral Island. Beach time and optional water activities.','Pattaya','Hotel','Breakfast / Dinner'),
('Day 03','Pattaya → Bangkok','Transfer to Bangkok. Evening city / market experience.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 04','Bangkok City Tour','Visit major city landmarks such as temples and riverside areas as per selected sightseeing plan.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 05','Bangkok Leisure / Shopping','Free time for shopping, cafés or optional experiences.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 06','Departure','Airport transfer.','Bangkok','—','Breakfast')],
'package-thailand-family.html': [
('Day 01','Arrival Bangkok → Pattaya','Airport pickup and family-friendly transfer to Pattaya.','Pattaya','Hotel','Dinner'),
('Day 02','Coral Island','Family beach day with optional water activities.','Pattaya','Hotel','Breakfast / Dinner'),
('Day 03','Pattaya → Bangkok','Transfer to Bangkok and leisure evening.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 04','Safari World + Marine Park','Full-day family attraction visit subject to operating schedule.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 05','Bangkok City Tour','Temples, riverfront and selected city highlights.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 06','Shopping / Leisure','Free time for shopping and family activities.','Bangkok','Hotel','Breakfast / Dinner'),
('Day 07','Departure','Airport transfer.','Bangkok','—','Breakfast')],
'package-dubai.html': [
('Day 01','Arrival Dubai','Airport pickup and hotel check-in. Evening leisure.','Dubai','Hotel','Dinner'),
('Day 02','Dubai City Tour','Visit major landmarks such as Jumeirah, Burj Al Arab photo stop, Dubai Marina and old-city areas as selected.','Dubai','Hotel','Breakfast / Dinner'),
('Day 03','Desert Safari','Afternoon desert transfer, dune experience, camp activities and dinner, subject to operator schedule.','Dubai','Hotel','Breakfast / Dinner'),
('Day 04','Burj Khalifa + Dubai Mall','Visit Burj Khalifa observation deck subject to ticket slot, followed by Dubai Mall leisure.','Dubai','Hotel','Breakfast / Dinner'),
('Day 05','Departure','Airport transfer.','Dubai','—','Breakfast')],
'package-bali.html': [
('Day 01','Arrival Bali → Ubud','Airport pickup and transfer to Ubud.','Ubud','Hotel','Dinner'),
('Day 02','Ubud Highlights','Visit selected rice terraces, waterfalls/temples and Ubud market.','Ubud','Hotel','Breakfast / Dinner'),
('Day 03','Nusa Penida Day Trip','Boat transfer for Nusa Penida sightseeing, subject to sea and weather conditions.','Bali','Hotel','Breakfast / Dinner'),
('Day 04','Ubud → South Bali','Transfer to the beach area and leisure evening.','South Bali','Hotel','Breakfast / Dinner'),
('Day 05','Temple + Beach Experience','Visit a major temple viewpoint and enjoy beach leisure depending on the selected plan.','South Bali','Hotel','Breakfast / Dinner'),
('Day 06','Departure','Airport transfer.','Denpasar','—','Breakfast')],
'package-vietnam.html': [
('Day 01','Arrival Hanoi','Airport pickup and hotel check-in. Evening Old Quarter walk.','Hanoi','Hotel','Dinner'),
('Day 02','Hanoi City Tour','Hoan Kiem area, key cultural landmarks and local streets according to the selected sightseeing plan.','Hanoi','Hotel','Breakfast / Dinner'),
('Day 03','Hanoi → Ha Long Bay','Transfer to Ha Long and board cruise. Overnight cruise subject to cruise schedule.','Ha Long Bay','Cruise','Breakfast / Lunch / Dinner'),
('Day 04','Ha Long → Hanoi → Da Nang','Morning cruise activities, disembark and continue to Da Nang by flight/transfer as booked.','Da Nang','Hotel','Breakfast / Dinner'),
('Day 05','Da Nang + Hoi An','Explore Da Nang highlights and evening Hoi An Ancient Town.','Da Nang / Hoi An','Hotel','Breakfast / Dinner'),
('Day 06','Hoi An Leisure','Free time for cafés, shopping, tailoring or optional activities.','Da Nang','Hotel','Breakfast / Dinner'),
('Day 07','Departure','Airport transfer.','Da Nang','—','Breakfast')],
}

# Fix variable-length day counts to match page durations where practical; itineraries intentionally may include a buffer day for operational flexibility.

def build_html(days):
    cards=[]
    for i,(day,title,desc,city,stay,meal) in enumerate(days):
        cards.append(f'''<article class="day-card"><div class="day-no">{day}</div><div class="day-main"><h3>{title}</h3><p>{desc}</p><div class="day-meta"><span>📍 <b>Route:</b> {city}</span><span>🏨 <b>Stay:</b> {stay}</span><span>🍽️ <b>Meals:</b> {meal}</span></div></div></article>''')
    return f'''<section class="section itinerary-section"><div class="section-head"><div><div class="eyebrow">DAY-WISE PLAN</div><h2>Complete Itinerary</h2><p class="itinerary-intro">A clear day-by-day travel plan with pickup, sightseeing, stay and meal flow. Final timings, hotels, permits and route sequence are confirmed by our travel team before departure.</p></div></div><div class="itinerary-grid">{''.join(cards)}</div><div class="itinerary-note"><b>Pickup & Drop:</b> Airport / railway station / bus stand pickup and drop are based on the package's confirmed starting point. <b>Important:</b> High-altitude, pilgrimage, border-area and international activities are subject to weather, permits, local regulations and operating conditions.</div></section>'''

for fname,days in ITINS.items():
    p=base/fname
    if not p.exists():
        continue
    txt=p.read_text()
    if 'class="itinerary-section"' in txt:
        txt=re.sub(r'<section class="section itinerary-section">.*?</section>', build_html(days), txt, flags=re.S)
    else:
        marker='</section><footer>'
        if marker not in txt:
            print('marker missing',fname); continue
        txt=txt.replace(marker, '</section>'+build_html(days)+'<footer>', 1)
    p.write_text(txt)

# Add shared styling before </style> in style.css
css=base/'style.css'
ct=css.read_text()
if '.itinerary-section' not in ct:
    add='''\n/* V28 day-wise itinerary */\n.itinerary-section{padding-top:10px}.itinerary-section .section-head{margin-bottom:24px}.itinerary-intro{max-width:820px;color:#687780;line-height:1.75}.itinerary-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.day-card{display:grid;grid-template-columns:92px 1fr;gap:18px;background:#fff;border:1px solid #e7edf1;border-radius:18px;padding:18px;box-shadow:0 10px 28px rgba(7,26,46,.06)}.day-no{font-weight:900;color:#fff;background:linear-gradient(135deg,#071a2e,#0e3560);border-radius:14px;display:flex;align-items:center;justify-content:center;min-height:58px;font-size:13px;letter-spacing:.5px}.day-main h3{margin:0 0 7px;color:#071a2e;font-size:18px}.day-main p{margin:0 0 12px;color:#687780;line-height:1.7}.day-meta{display:flex;flex-wrap:wrap;gap:8px}.day-meta span{font-size:12px;color:#52616b;background:#f6f8fa;border-radius:999px;padding:7px 10px}.itinerary-note{margin-top:18px;padding:16px 18px;border-radius:14px;background:#f7fafc;border:1px solid #e5edf2;color:#62717a;line-height:1.7;font-size:13px}@media(max-width:800px){.itinerary-grid{grid-template-columns:1fr}.day-card{grid-template-columns:76px 1fr}}@media(max-width:520px){.day-card{grid-template-columns:1fr}.day-no{min-height:44px;justify-content:flex-start;padding:0 14px}.day-meta{display:grid;grid-template-columns:1fr}}\n'''
    ct=ct.replace('</style>',add+'</style>',1)
    css.write_text(ct)

# Update version markers/readme
readme=base/'README.txt'
if readme.exists():
    readme.write_text(readme.read_text()+"\nV28 update: day-wise itineraries added to all destination package pages. Itinerary content is original/reworked for On A Trip Holidays and should be confirmed operationally before publishing.\n")

print('updated',len(ITINS),'package pages')
