# MapSite-Template
Just a template to show how to create a site using data built from using the Map Builder

Couple important notes as code may require modification depending on your needs,
<ul>
  <li>
    Storing map data string from Map Builder. Look in mapScript.js I left an example of how to setup the map data to be tied with the according building and floor. Its just a map with building names as keys and arrays as the key values, to be used to store floor data.
  </li>
  <li>
    Make sure to edit the logic for converting a room number to the corresponding floor, as is it just checks the first character of the room number and assumes thats the floor. For example room 200 is assumed to be on floor 2 as the character is on floor 2. Same for if the room number is 2000 it will assume it is floor 2. So if your buildings floors are divided by the 100's or 1000's exclusivley then there won't be an issue. However if your building has existing room 200 and room 2000 on seperate floors then you'll end up with a floor mix up. So just make sure to modify floor logic attached to the roomnumberInput listener in script.js
  </li>
  <li>
    This part is very important to where you place your floorplan images as well as how you name them. To correctly look up the according floorplan for a roomnumber the code creates a file path from the \floorplan folder to the floor plan image that must follow the following naming format, "Floorplan #.png", ex "Floorplan 1.png". It won't work with non pdfs since i hard coded the png part so edit that if you want. So do this.
    Create a folder in \Floorplans that matches the string key you stored the map data in. So \Floorplans\Example Building\ then place the according floorplans inside, \Floorplans\Example Building\Floorplan 1.png
  </li>
</ul>
