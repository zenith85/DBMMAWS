// Define different color palettes
const colorPalettes = [
  {
    '--black': '#000000',
    '--white': '#ffffff',
    '--BGMains': '#EAE7DC',
    '--BGSides': '#C26E13',
    '--FontColor1': '#8E8D8A',
    '--HoverEffect': '#E98074',
    '--Buttons': '#E85A4F',
    '--ButtonsTXT': '#000000',
  },
  {
    '--black': '#000000',
    '--white': '#ffffff',
    '--BGMains': '#05386B',
    '--BGSides': '#379683',
    '--FontColor1': '#5CDB95',
    '--HoverEffect': '#8EE4AF',
    '--Buttons': '#EDF5E1',
    '--ButtonsTXT': '#000000',
  },
  {
    '--black': '#fff000',
    '--white': '#ffffff',
    '--BGMains': '#0C0032',
    '--BGSides': '#190061',
    '--FontColor1': '#fff000',
    '--HoverEffect': '#3500D3',
    '--Buttons': '#282828',
    '--ButtonsTXT': '#FFFFFF',
  },
  {
    '--black': '#000000',
    '--white': '#000000',
    '--BGMains': '#EDC7B7',
    '--BGSides': '#EEE2DC',
    '--FontColor1': '#00000',
    '--HoverEffect': '#123C69',
    '--Buttons': '#A1B61',
    '--ButtonsTXT': '#000000',
  },
  {
    '--black': '#000000',
    '--white': '#ffffff',
    '--BGMains': '#2FontColor1531',
    '--BGSides': '#116466',
    '--FontColor1': '#D9B08C',
    '--HoverEffect': '#FFblack9A',
    '--Buttons': '#D1E8E2',
    '--ButtonsTXT': '#000000',
  },
  {
    '--black': '#000000',
    '--white': '#ffffff',
    '--BGMains': '#272727',
    '--BGSides': '#747474',
    '--FontColor1': '#FF652F',
    '--HoverEffect': '#FFE400',
    '--Buttons': '#14A76C',
    '--ButtonsTXT': '#000000',
  },
  {
    '--black': '#000000',
    '--white': '#ffffff',
    '--BGMains': '#EAE7DC',
    '--BGSides': '#000000',
    '--FontColor1': '#8E8D8A',
    '--HoverEffect': '#E98074',
    '--Buttons': '#E85A4F',
    '--ButtonsTXT': '#000000',
  },
  // Add more color palettes as needed
];
// Counter to keep track of the current color palette
let currentPaletteIndex = 0;
// Function to switch to the next color palette
function switchColorPalette() {
  currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
  // Apply the new color palette to document root
  const root = document.documentElement;
  const newPalette = colorPalettes[currentPaletteIndex];
  for (const [property, value] of Object.entries(newPalette)) {
    root.style.setProperty(property, value);
  }
}
// Add event listener to the switch palette button
const switchPaletteButton = document.getElementById('switchPaletteButton');
switchPaletteButton.addEventListener('click', switchColorPalette);

// Function to handle tab switching and show/hide containers and activate list calling
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const containerId = tab.getAttribute('data-container');
    switchTab(containerId);
  });
});

function switchTab(containerId) {
  // Hide all collection list containers
  document.getElementById('companies-container').style.display = 'none';
  document.getElementById('projects-container').style.display = 'none';
  document.getElementById('members-container').style.display = 'none';
  // Show the selected collection list container
  document.getElementById(containerId).style.display = 'block';
  // Clear selection styles from all tabs
  tabs.forEach(tab => tab.classList.remove('selected'));
  // Add the selected style to the clicked tab
  const selectedTab = document.querySelector(`[data-container="${containerId}"]`);
  selectedTab.classList.add('selected');
  //fetch collections for the selected tabs
  switch (containerId) {
    case "projects-container":
    fetchCollections("Project Name", "ProjectsCollection", 'projects-container-list', 'project-search');
    addCompanyButton.style.display = 'none';
    addMemberButton.style.display = "none";
    addProjectButton.style.display = 'block';
    break;
    case "companies-container":
    fetchCollections("Company Name", "CompaniesCollection", 'companies-container-list', 'company-search');
    addCompanyButton.style.display = 'block';
    addMemberButton.style.display = "none";
    addProjectButton.style.display = 'none';
    break;
    case "members-container": // Add this case
    fetchCollections("Member Name", "MembersCollection", 'members-container-list', 'member-search');
    addCompanyButton.style.display = 'none'; // Adjust these based on your requirements
    addMemberButton.style.display = "block";
    addProjectButton.style.display = 'none'; // Adjust these based on your requirements
    break;
    default:
    console.log("container doesn't exist");
  }
}
// Function to fetch data from a collection based on a key
async function fetchData(collectionEndpoint, key) {
  try {
    const response = await fetch(collectionEndpoint);
    const data = await response.json();
    return data.map(item => item[key]);
  } catch (error) {
    console.error(`Error fetching data from ${collectionEndpoint}:`, error);
    return [];
  }
}
// Fetch collections from the server and populate the left column as a list
async function fetchCollections(key, collectionName,rendertothisUI,searchFieldID) {
  try {
    const searchInput = document.getElementById(searchFieldID).value;
    const response = await fetch(`/collections/${collectionName}?search=${searchInput}`);
    const collections = await response.json();
    const collectionList = document.getElementById(rendertothisUI);
    collectionList.innerHTML = ''; // Clear previous content
    collections.forEach(doc => {
      const listItem = document.createElement('li');
      listItem.className = 'LClist-item';
      //this next line will help the program to pull the document by its (Name)
      listItem.textContent = doc[key];
      listItem.addEventListener('click', () => showContent(doc, listItem));
      collectionList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching collections:', error.message);
  }
}

// Fetch content for a selected collection and display it in the right column
async function showContent(doc, listItem) {
  // Clear selection from all list items
  clearSelection();
  // Highlight the selected list item
  listItem.classList.add('selected');
  const contentContainer = document.getElementById('content');
  // Clear previous content
  contentContainer.innerHTML = '';
  // Iterate over the keys and values in the document
  Object.entries(doc).forEach(([key, value]) => {
    // Exclude keys that contain "_id"
    if (!key.includes("_id")) {
      // Create a div element for each key-value pair
      const pairDiv = document.createElement('div');
      // Create span elements for key and value
      const keySpan = document.createElement('span');
      const valueSpan = document.createElement('span');
      // Set text content and styles for key and value
      keySpan.textContent = key + ': ';
      keySpan.style.color = 'blue'; // Set the color for keys
      valueSpan.textContent = value;
      valueSpan.style.color = 'green'; // Set the color for values
      // Append key and value spans to the pair div
      pairDiv.appendChild(keySpan);
      pairDiv.appendChild(valueSpan);
      // Append the pair div to the content container
      contentContainer.appendChild(pairDiv);
    }
  });
}

// Clear selection from all list items
function clearSelection() {
  const listItems = document.querySelectorAll('.LClist-item');
  listItems.forEach(item => item.classList.remove('selected'));
}
// Function to add the new company document modal
function openNewCompanyDocumentModal() {
  document.getElementById('new-company-document-modal').style.display = 'flex';
}
function closeNewCompanyDocumentModal() {
  document.getElementById('new-company-document-modal').style.display = 'none';
}
async function createNewCompanyDocument() {
  const companyName = document.getElementById('new-company-document-name').value;
  const location = document.getElementById('company-location').value;
  const contactPerson = document.getElementById('company-details').value;
  const responsibleMember = document.getElementById('company-documents').value;
  const responsibleMemberEmail = document.getElementById('company-email').value;
  const contactEmail = document.getElementById('company-contact-email').value;
  const companyWebsite = document.getElementById('company-website').value;
  const additionalInformation = document.getElementById('company-additional-information').value;

  try {
    const response = await fetch('/create-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionName: 'CompaniesCollection',
        document: {
          'Company Name': companyName,
          'Location/Address': location,
          'Contact person': contactPerson,
          'Responsible member': responsibleMember,
          'Responsible member email': responsibleMemberEmail,
          'Contact email': contactEmail,
          'Company website': companyWebsite,
          'Additional information': additionalInformation,
        },
      }),
    });
    const result = await response.json();
    console.log('Response:', response);
    console.log('Result:', result);

    if (result.success) {
      // Close the modal
      closeNewCompanyDocumentModal();
      // Clear input values
      document.getElementById('new-company-document-name').value = '';
      document.getElementById('company-location').value = '';
      document.getElementById('company-details').value = '';
      document.getElementById('company-documents').value = '';
      document.getElementById('company-email').value = '';
      document.getElementById('company-contact-email').value = '';
      document.getElementById('company-website').value = '';
      document.getElementById('company-additional-information').value = '';
      // Refresh the collections list
      fetchCollections("Company Name", "CompaniesCollection", 'companies-container-list', 'company-search');
    } else {
      console.error('Error creating new document:', result.error);
    }
  } catch (error) {
    console.error('Error creating new document:', error.message);
  }
}
// Function to add the new project document modal
// function openNewProjectDocumentModal() {
//   document.getElementById('new-project-document-modal').style.display = 'flex';
//
// }
async function openNewProjectDocumentModal() {
  document.getElementById('new-project-document-modal').style.display = 'flex';
  try {
    // Fetch member names from MembersCollection
    const memberNames = await fetchData('/collections/MembersCollection', 'Member Name');
    // Get the modal element
    const modal = document.getElementById('new-project-document-modal');
    // Populate the responsible members dropdown list
    const responsibleMembersDropdown = modal.querySelector('#project-responsible-members');
    responsibleMembersDropdown.innerHTML = ''; // Clear previous options

    // Create an option for each member name
    memberNames.forEach(memberName => {
      const option = document.createElement('option');
      option.value = memberName;
      option.textContent = memberName;
      responsibleMembersDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error opening new project document modal:', error);
  }
}

function closeNewProjectDocumentModal() {
  document.getElementById('new-project-document-modal').style.display = 'none';
}
async function createNewProjectDocument() {
  // Retrieve values from the modal form
  const projectName = document.getElementById('new-project-document-name').value;
  const responsibleMembers = document.getElementById('project-responsible-members').value;
  const projectDetails = document.getElementById('project-details').value;

  try {
    const response = await fetch('/create-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionName: 'ProjectsCollection',
        document: {
          'Project Name': projectName,
          'Responsible Members': responsibleMembers,
          'Project Details': projectDetails,
        },
      }),
    });
    const result = await response.json();
    console.log('Response:', response);
    console.log('Result:', result);
    if (result.success) {
      // Close the modal
      closeNewProjectDocumentModal();
      // Clear input values
      document.getElementById('new-project-document-name').value = '';
      document.getElementById('project-responsible-members').value = '';
      document.getElementById('project-details').value = '';
      // Refresh the projects list
      fetchCollections("Project Name", "ProjectsCollection", 'projects-container-list', 'project-search');
    } else {
      console.error('Error creating new project document:', result.error);
    }
  } catch (error) {
    console.error('Error creating new project document:', error.message);
  }
}

// Add this function to open the new member modal
function openNewMemberDocumentModal() {
  document.getElementById('new-member-document-modal').style.display = 'flex';
}

// Add this function to close the new member modal
function closeNewMemberDocumentModal() {
  document.getElementById('new-member-document-modal').style.display = 'none';
}

// Add this function to create a new member document
async function createNewMemberDocument() {
  // Retrieve values from the modal form
  const memberName = document.getElementById('new-member-document-name').value;
  const contactInfo = document.getElementById('new-member-contact-info').value;
  const company = document.getElementById('new-member-company').value;
  const contactEmail = document.getElementById('new-member-contact-email').value;
  try {
    const response = await fetch('/create-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionName: 'MembersCollection',
        document: {
          'Member Name': memberName,
          'Contact Information': contactInfo,
          'Company': company,
          'Contact Email': contactEmail,
        },
      }),
    });
    const result = await response.json();
    console.log('Response:', response);
    console.log('Result:', result);
    if (result.success) {
      // Close the modal
      closeNewMemberDocumentModal();
      // Clear input values
      document.getElementById('new-member-document-name').value = '';
      document.getElementById('new-member-contact-info').value = '';
      document.getElementById('new-member-company').value = '';
      document.getElementById('new-member-contact-email').value = '';

      // Refresh the members list
      fetchCollections("Member Name", "MembersCollection", 'members-container-list', 'member-search');
    } else {
      console.error('Error creating new member document:', result.error);
    }
  } catch (error) {
    console.error('Error creating new member document:', error.message);
  }
}

// Add event listener to the new member tab
const newMemberTab = document.querySelector('[data-container="members-container"]');
newMemberTab.addEventListener('click', () => switchTab('members-container'));
// Fetch collections when the page loads
window.onload = () => {
  // Assuming you want to hide 'projects-container' initially
  containerId='companies-container';
  switchTab(containerId);
};

// Add an event listener to the textarea for input changes
document.getElementById('project-details').addEventListener('input', function () {
  // Count the number of newline characters in the textarea content
  const newLines = (this.value.match(/\n/g) || []).length + 1;
  // Set the number of rows based on the newline count
  this.rows = newLines;
});

// Attach the fetchCollections function to the input's 'input' event
document.getElementById('project-search').addEventListener('input', () => fetchCollections("Project Name", "ProjectsCollection", 'projects-container-list', 'project-search'));
document.getElementById('company-search').addEventListener('input', () => fetchCollections("Company Name", "CompaniesCollection", 'companies-container-list', 'company-search'));
document.getElementById('member-search').addEventListener('input', () => fetchCollections("Member Name", "MembersCollection", 'members-container-list', 'member-search'));
