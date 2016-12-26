## Final 1
AA meetings project.
There are several AA meetings per day in and around NYC, at different locations and with a different format (Open Discussion, Closed Discussions, Beginners Meetings, etc.). The purpose of this project was to make a map of NYC listing all the relevant meetings. Per location, a small infowindow (pop-up) should provide relevant information with info windows. The relevant meetings and information depend on the viewer and the time she/he uses the website. Ideally, the user should get the meetings (and few relevant details) for the next 24 hours with a link to that location for more info. 
 
 The data is scraped from the AA meetings around NYC from the AA website. The longitude/latitude, the map and infowindows were made with the Google Maps API.
 
[Link to website](https://preview.c9users.io/isaverkes/fall16/HW5/map.html?_c9_id=livepreview3&_c9_host=https://ide.c9.io)
![Screenshot](https://github.com/IsVer/data-structures/blob/master/HW5/Screen%20Shot%202016-12-26%20at%202.59.06%20PM.png)

####Index
Files in this directory:
- ".js": cleans the data from the ten static HTML files, listing all the meetings and their details.
- as a result, see the text files like "cleaned_textm01.txt" until "cleaned_textm10.txt".
- using the GoogleMaps API, retrieved latitude and longitude for every locataion 
- "fullMeetings.txt": after restructuring and aggregation  of the full data
- "app.js": lists the name of the data base and collection, in preperation for the connection with MongoDB
- "merge.js": seeks to merge and manipulate the data to create the appropriate format for the Google Maps map and infowindows. The getNowDay function produces the current day - so the viewer sees the only the information for that day for that location.


####Comments
The current version is not too user-friendly:
- the viewer may wants to see more than todays meetings, especially as it is already late at the day;
- it can be frustrating to see the "Please check another day" without a link or reference to other location that do have meetings that day.
