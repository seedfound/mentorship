document.addEventListener('DOMContentLoaded', function() {
  var teacherSelect = document.getElementById('teacherSelect');
  var selectionForm = document.getElementById('selectionForm');

  // Handle form submission
  selectionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the selected teacher values
    var selectedTeachers = Array.from(teacherSelect.selectedOptions, function(option) {
      return option.value;
    });

    // Get the inputted name
    var nameInput = document.getElementById('nameInput');
    var name = nameInput.value;

    // Save the data to local storage
    var data = {
      name: name,
      teachers: selectedTeachers
    };
    localStorage.setItem('selectionData', JSON.stringify(data));

    // Reset the form
    nameInput.value = '';
    teacherSelect.selectedIndex = -1;
    alert('Selection saved successfully!');
  });

  // Load teacher data from Excel sheet
  Papa.parse('teachers.csv', {
    download: true,
    complete: function(results) {
      var teachers = results.data.map(function(row, index) {
        return {
          id: index + 1,
          name: row[0]
        };
      });

      // Dynamically populate teacher select options
      teachers.forEach(function(teacher) {
        var option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        teacherSelect.appendChild(option);
      });
    }
  });
});
