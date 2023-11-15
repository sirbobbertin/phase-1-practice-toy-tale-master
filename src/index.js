let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.getElementsByClassName("add-toy-form");
  const submitButton = document.getElementById("submit");
  const toyContainer = document.getElementById("toy-collection");
  

  const fetchToys = async () => {
    try {
      const response = await fetch("http://localhost:3000/toys");
      const toys = await response.json();

      // Clear existing toys
      toyContainer.innerHTML = "";

      // Render each toy
      toys.forEach(toy => renderToy(toy));
    } catch (error) {
      console.error("Error fetching toys:", error);
    }
  };

  const renderToy = (toy) => {
    const toyCard = document.createElement("div");
    toyCard.setAttribute("class","card");

    toyCard.innerHTML = `
      <h3>${toy.name}</h3>
      <img src=${toy.image} class="toy-avatar" />
      <p>Likes: <span id="likes-${toy.id}">${toy.likes}</span></p>
      <button class="like-btn" data-id="${toy.id}">Like</button>
    `;

    toyContainer.appendChild(toyCard);

    
    const likeButton = toyCard.querySelector(".like-btn");
    likeButton.addEventListener("click", () => handleLike(toy.id, toy.likes));
  };

  fetchToys();


    // Function to handle likes
    const handleLike = async (toyId, currentLikes) => {
      try {
        const updatedLikes = currentLikes + 1;
  
        // Update likes in the database
        await fetch(`http://localhost:3000/toys/${toyId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            likes: updatedLikes,
          }),
        });
  
        // Update likes in the DOM
        const likesSpan = document.getElementById(`likes-${toyId}`);
        likesSpan.textContent = updatedLikes;
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    };


    // Event listener for form submission
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const toyName = document.getElementsByName("name")[0].value;
    const toyImage = document.getElementsByName("image")[0].value;
    const response = await fetch("http://localhost:3000/toys");
    const toys = await response.json();

    let newId = Math.max(toys.id);
    //const toyLikes = document.getElementById("toyLikes").value;

    // Add the new toy to the database
    await fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newId,
        name: toyName,
        likes: 0,
        image: toyImage
      }), 
    });
    console.log("test");

    // Fetch and render updated list of toys
    fetchToys();

    // Clear the form
    //toyForm.reset();
  });

  // Fetch and render initial list of toys
  fetchToys();
});
