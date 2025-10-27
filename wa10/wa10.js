        const dogImg = document.querySelector('#dog-img');
const dogFact = document.querySelector('#dog-fact');
const dogBtn = document.querySelector('#js-new-dog');
const factBtn = document.querySelector('#js-new-fact');


const dogEndpoint = "https://dog.ceo/api/breeds/image/random";
    const factEndpoints = [
      { url: "https://dogapi.dog/api/v2/facts", parse: data => (data?.data?.[0]?.attributes?.body) },
      { url: "https://dog-api.kinduff.com/api/facts", parse: data => (data?.facts?.[0]) }
    ];

async function newDog() {
    try {
        const response = await fetch(dogEndpoint);
        if (!response.ok) throw Error(response.statusText);
        const json = await response.json();
        dogImg.src = json.message;
    } catch (err) {
        console.error("Dog image error",err)
        alert('Failed to fetch dogs');
    }
}
async function newFact() {
    for (const ep of factEndpoints) {
        try {
            const res = await fetch(ep.url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const fact = ep.parse(data);
            if (fact && typeof fact === 'string') {
                dogFact.textContent = fact;
                return;
            } else {
                throw new Error("unknown");
            }
         } catch (e) {
                console.warn(`Fact endpoint failed: ${ep.url}`, e);
            }
        }
    dogFact.textContent = 'Could not fetch a dogfact right now';

    }
    

    dogBtn.addEventListener('click', newDog);
    factBtn.addEventListener('click', newFact);

    newDog();
    newFact();