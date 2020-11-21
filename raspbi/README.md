Installing the runwork.py script to run automatically on reboot
===============================================================

1. Determine the path to the virtualenv used by your python script
   Assuming you have cloned the repo to your home directory and you created a virtualenv 
   for the project, you should have a virtualenv folder in your home directory
   e.g /home/pi/.local/share/virtualenvs/raspbi. Copy this path as you will need to enter it in step 2. You will also need the path to the directory where you cloned the repo.
2. Use the crontab -e command to add an entry to your root crontab file. For the first argument, paste in the virtualenv path to the python executable into the file. The second argument should be the absolute path to the the runwork script. An example of what the entry should look like is below:
	`@reboot /home/pi/.local/share/virtualenvs/raspbi-Pmn_b57K/bin/python /home/pi/code/rheadoor/raspbi/runwork.py`	
3. Reboot your raspberry pi. The runwork script will be run automatically everytime it reboots.
