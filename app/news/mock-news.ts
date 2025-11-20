/**
 * Mock news articles for development and preview
 * Matches the NewsArticle type structure
 */

import type { NewsArticle } from '@/types/news';
import { NewsStatus, NewsType } from '@/types/news';

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Miami Art Week 2024: A Celebration of Contemporary Culture',
    slug: 'miami-art-week-2024-celebration-contemporary-culture',
    body: `<p>Miami Art Week returns with an incredible lineup of galleries, installations, and performances across the city. This year's event features over 200 artists from around the world, showcasing everything from contemporary paintings to immersive digital experiences.</p>

<p>The week-long celebration includes special events at the Pérez Art Museum, Art Basel Miami Beach, and numerous satellite fairs throughout Wynwood and the Design District. From December 1-8, art lovers will have the chance to explore cutting-edge contemporary art, attend exclusive gallery openings, and experience large-scale installations that transform public spaces.</p>

<p>This year's highlight is the opening of "Luminous Horizons," a spectacular light installation at the Miami Beach Convention Center that uses advanced LED technology to create an interactive art experience. Visitors can walk through the installation, which responds to movement and creates unique visual patterns.</p>

<p>Art Basel Miami Beach, the crown jewel of the week, brings together over 280 galleries from across the globe. The main fair features works from both established masters and emerging talents, with price points ranging from a few thousand dollars to multi-million-dollar pieces.</p>

<p>Wynwood Arts District becomes a hub of activity during Art Week, with pop-up galleries, street performances, and late-night art parties. The neighborhood's famous murals serve as a backdrop to temporary installations and interactive exhibits.</p>

<p>For those looking to purchase art, several satellite fairs offer more accessible entry points into the art market. SCOPE Miami Beach showcases emerging artists, while Art Miami focuses on established contemporary works. Design Miami, running concurrently, highlights collectible design objects and furniture.</p>

<p>Beyond the galleries and fairs, Art Week includes a robust program of artist talks, panel discussions, and workshops. Topics range from "The Future of Digital Art" to "Collecting Art on a Budget," making the week accessible to both seasoned collectors and first-time attendees.</p>

<p>Miami Art Week has become one of the most important cultural events in the Americas, drawing collectors, curators, and art enthusiasts from around the world. Whether you're a serious collector or simply curious about contemporary art, there's something for everyone during this transformative week.</p>`,
    heroImage: 'mock-hero-1.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=628&fit=crop',
    heroImageAlt: 'Contemporary art installation at Miami Art Week',
    authorName: 'Sarah Martinez',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    featuredUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Featured for 5 more days
    metaTitle: 'Miami Art Week 2024 - Cultural Events Guide',
    metaDescription: 'Discover the best of Miami Art Week 2024 with our comprehensive guide to galleries, installations, and cultural events.',
    categories: [
      {
        id: 'cat-1',
        name: 'Arts & Culture',
        slug: 'art',
        description: 'Visual arts, galleries, and cultural events',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-1', name: 'art-week', display: 'Art Week' },
      { id: 'tag-2', name: 'miami', display: 'Miami' },
      { id: 'tag-3', name: 'contemporary-art', display: 'Contemporary Art' }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'New Jazz Venue Opens in Downtown Miami',
    slug: 'new-jazz-venue-opens-downtown-miami',
    body: `<p>The Blue Note Miami has officially opened its doors, bringing world-class jazz performances to the heart of downtown. The 300-seat venue features state-of-the-art acoustics and an intimate atmosphere perfect for experiencing live jazz.</p>

<p>Opening night featured performances by Grammy-winning artists, and the venue has already announced a packed schedule for the coming months. Located in the bustling Brickell neighborhood, Blue Note Miami joins the prestigious network of Blue Note venues worldwide, including New York, Tokyo, and Milan.</p>

<p>The space itself is a work of art—designed with acoustics as the primary consideration, every surface has been carefully engineered to provide optimal sound quality. The stage sits close to the audience, creating an intimate connection between performers and listeners that's rare in larger venues.</p>

<p>Executive Chef Maria Rodriguez has curated a menu that perfectly complements the musical experience. Small plates inspired by jazz's cultural roots—from New Orleans to Havana—are available throughout performances. The bar features craft cocktails named after jazz legends, with a particular focus on classic drinks from the jazz age.</p>

<p>The inaugural season lineup reads like a who's who of contemporary jazz: Herbie Hancock, Esperanza Spalding, and Kamasi Washington are among the headliners. But the venue also champions local talent, with weekly "Miami Jazz Sessions" featuring homegrown musicians.</p>

<p>What sets Blue Note Miami apart is its commitment to education. The venue hosts jazz workshops for students, masterclasses with visiting artists, and community programs aimed at preserving and celebrating jazz culture in Miami.</p>

<p>Tickets range from $45 for general admission to $200 for VIP experiences that include meet-and-greets with artists and premium seating. For jazz enthusiasts, membership programs offer discounts, priority booking, and exclusive access to special events.</p>

<p>The opening represents a significant moment for Miami's cultural scene, providing a dedicated space for jazz in a city known more for electronic music and Latin rhythms. But as the first notes rang out on opening night, it was clear that Miami was ready for this new addition to its musical landscape.</p>`,
    heroImage: 'mock-hero-2.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=628&fit=crop',
    heroImageAlt: 'Jazz performance at Blue Note Miami',
    authorName: 'Michael Chen',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    metaTitle: 'Blue Note Miami Opens - New Jazz Venue',
    metaDescription: 'Experience world-class jazz at Miami\'s newest venue, Blue Note Miami, now open in downtown.',
    categories: [
      {
        id: 'cat-2',
        name: 'Things to Do',
        slug: 'things-to-do',
        description: 'Live music, concerts, and performances',
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-4', name: 'jazz', display: 'Jazz' },
      { id: 'tag-5', name: 'live-music', display: 'Live Music' },
      { id: 'tag-2', name: 'miami', display: 'Miami' }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Theater Festival Showcases Local Talent',
    slug: 'theater-festival-showcases-local-talent',
    body: `<p>The annual Miami Theater Festival kicked off this weekend with a diverse lineup of productions from local theater companies. This year's festival highlights emerging playwrights and innovative staging techniques that push the boundaries of traditional theater.</p>

<p>Over 20 productions will be staged across multiple venues, including both traditional theaters and pop-up spaces throughout the city. The festival runs for three weeks, offering theater lovers an opportunity to experience Miami's vibrant theater scene at its most dynamic.</p>

<p>This year's theme, "Voices of Miami," celebrates the diverse stories that make up the city's cultural fabric. Productions range from autobiographical one-woman shows exploring immigration experiences to ensemble pieces examining gentrification in historic neighborhoods.</p>

<p>The festival opens with "Calle Ocho Dreams," a bilingual production that weaves together stories of Cuban-American families across three generations. Playwright Elena Fernandez spent two years conducting interviews with community members to create this powerful work.</p>

<p>Innovative staging takes center stage with several site-specific productions. "Under the Bridge" performs literally under the MacArthur Causeway, using the structure itself as part of the set. "The Rooftop Sessions" transforms parking garages into intimate performance spaces with stunning views of the city skyline.</p>

<p>New works by emerging playwrights are featured prominently, with dedicated slots each weekend for works-in-progress. Audiences can provide feedback during post-show discussions, creating a collaborative environment between artists and viewers.</p>

<p>Family programming includes puppet shows, interactive theater experiences for children, and adaptations of classic stories with Miami-specific twists. These productions make the festival accessible to all ages, introducing younger audiences to the magic of live theater.</p>

<p>Ticket prices range from $20 for general admission to $75 for VIP packages that include drinks and artist meet-and-greets. Many shows offer pay-what-you-can performances, ensuring economic accessibility.</p>

<p>The festival also includes a professional development component, with workshops on playwriting, directing, and technical theater. These sessions are open to both aspiring and established theater professionals.</p>

<p>As the festival continues through the month, it serves as a reminder of Miami's rich theater community—one that often flies under the radar compared to the city's music and visual arts scenes, but is just as vital and innovative.</p>`,
    heroImage: 'mock-hero-3.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=628&fit=crop',
    heroImageAlt: 'Theater performance at Miami Theater Festival',
    authorName: 'Emily Rodriguez',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    metaTitle: 'Miami Theater Festival 2024 - Local Productions',
    metaDescription: 'Discover the best of local theater at the annual Miami Theater Festival featuring emerging playwrights and innovative productions.',
    categories: [
      {
        id: 'cat-3',
        name: 'Things to Do',
        slug: 'things-to-do',
        description: 'Live theater, plays, and dramatic performances',
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-6', name: 'theater', display: 'Theater' },
      { id: 'tag-7', name: 'festival', display: 'Festival' },
      { id: 'tag-8', name: 'local-talent', display: 'Local Talent' }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Culinary Arts: Miami\'s Top Chefs Collaborate for Charity',
    slug: 'culinary-arts-miami-top-chefs-collaborate-charity',
    body: `<p>Ten of Miami's most celebrated chefs came together last weekend for an exclusive charity dinner benefiting local arts education programs. The event raised over $50,000 and featured a unique collaborative menu that showcased the best of Miami's culinary talent.</p>

<p>Each chef contributed a signature dish, creating a culinary journey that showcased the diversity of Miami's food scene. The evening began with passed appetizers by Chef Michelle Bernstein, featuring her famous conch fritters reimagined with a modern twist. These were followed by Chef Michael Schwartz's wood-grilled octopus with Peruvian potatoes.</p>

<p>The five-course dinner that followed was nothing short of spectacular. Chef José Andrés's team presented a second course of Spanish gazpacho with local Florida tomatoes, served in an ice-filled bowl. The gazpacho's refreshing coolness was perfectly balanced by the heat of the main course: Chef Norman Van Aken's signature jerk-spiced whole fish, prepared tableside.</p>

<p>What made the evening special wasn't just the food, but the stories each chef shared about their connection to arts education. Chef Andrés spoke about how cooking classes in his restaurants have helped young people develop confidence and creativity. Chef Schwartz shared that his restaurant group offers internships to culinary students from underserved communities.</p>

<p>The evening's highlight was the dessert course—a collaborative effort between pastry chefs that resulted in a stunning "art gallery" of sweets. Chocolate sculptures, sugar paintings, and edible interpretations of famous artworks adorned the tables, blurring the lines between culinary art and visual art.</p>

<p>Between courses, live music from students at Miami Arts Charter School filled the space. The students' performances—from jazz to classical—demonstrated the very programs the evening was supporting.</p>

<p>The $50,000 raised will go directly to several local organizations: Arts for Learning Miami, which brings professional artists into schools; the Miami Children's Museum's art programs; and scholarships for students pursuing arts degrees at local universities.</p>

<p>The event also featured a silent auction with items donated by the chefs and local businesses. Cooking classes, private dinners, and original artworks were among the items that helped boost fundraising efforts.</p>

<p>As the evening drew to a close, organizers announced that this would become an annual event, with plans to expand next year. The success of the evening demonstrated not just Miami's culinary excellence, but the community's commitment to supporting the next generation of artists.</p>

<p>For those who missed this year's event, several of the participating restaurants will be offering special "Chefs for Arts" menu items throughout the month, with a portion of proceeds continuing to support arts education programs.</p>`,
    heroImage: 'mock-hero-4.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=628&fit=crop',
    heroImageAlt: 'Chef preparing dish at charity culinary event',
    authorName: 'David Kim',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    metaTitle: 'Miami Chefs Charity Dinner - Culinary Arts Event',
    metaDescription: 'Top Miami chefs collaborate for charity dinner supporting arts education, raising $50,000 for local programs.',
    categories: [
      {
        id: 'cat-city-guides',
        name: 'City Guides',
        slug: 'city-guides',
        description: 'City guides, recommendations, and local insights',
        order: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-9', name: 'culinary', display: 'Culinary' },
      { id: 'tag-10', name: 'charity', display: 'Charity' },
      { id: 'tag-11', name: 'chefs', display: 'Chefs' }
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'Street Art Mural Project Transforms Wynwood District',
    slug: 'street-art-mural-project-transforms-wynwood-district',
    body: `<p>A massive new street art project has brought 15 new murals to the Wynwood Arts District, featuring works from internationally renowned artists. The project aims to revitalize several blocks while celebrating Miami's vibrant street art culture.</p>

<p>Artists from Colombia, Brazil, and Spain contributed to the project, each bringing their unique style to the walls of Wynwood. The "Wynwood Walls Reimagined" initiative transformed previously blank facades into vibrant canvases that tell stories of migration, community, and urban transformation.</p>

<p>Colombian artist Maria Gonzalez created a stunning 40-foot mural titled "Roots and Wings," exploring themes of displacement and belonging that resonate with Miami's immigrant communities. Her use of bold colors and flowing lines creates a sense of movement that captures the energy of the neighborhood.</p>

<p>Brazilian street artist Carlos Silva's contribution, "Ritmo Urbano," uses geometric patterns inspired by traditional Brazilian tiles, reimagined in Miami's tropical colors. The mural responds to its environment—the patterns seem to pulse with the rhythm of passing traffic and pedestrian movement.</p>

<p>Spanish artist Alejandro Martinez brought a more classical approach, creating photorealistic portraits of local residents against abstract backgrounds. His work, "Faces of Wynwood," celebrates the people who make the neighborhood what it is, from longtime residents to newcomers drawn by the area's creative energy.</p>

<p>The project took three months to complete, with artists working during early morning hours to avoid disrupting local businesses. The process became a community event in itself, with residents gathering to watch progress and share stories with the artists.</p>

<p>Beyond the visual transformation, the project includes QR codes on each mural that link to audio guides, artist interviews, and historical context about the neighborhood. This digital layer adds depth to the experience, making the murals more than just visual spectacles.</p>

<p>The murals have already become popular photo destinations, drawing both tourists and locals. But they also serve a deeper purpose: the project was funded in part by grants aimed at preserving the artistic character of Wynwood as the neighborhood faces pressure from development.</p>

<p>Local business owners report increased foot traffic since the murals were completed. The transformation has brought new energy to blocks that were previously less visited, demonstrating how public art can drive economic activity while enriching the community.</p>

<p>The project represents a collaboration between the Wynwood Business Improvement District, local property owners, and the artists themselves. It's a model that organizers hope to replicate in other neighborhoods, using art as a tool for community building and economic development.</p>

<p>As Wynwood continues to evolve, these murals serve as a reminder of the neighborhood's artistic roots—and a commitment to preserving its creative spirit in the face of change.</p>`,
    heroImage: 'mock-hero-5.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=628&fit=crop',
    heroImageAlt: 'Colorful street art mural in Wynwood',
    authorName: 'Jessica Torres',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    metaTitle: 'Wynwood Street Art Mural Project - New Murals',
    metaDescription: 'Discover 15 new street art murals transforming Wynwood, featuring international artists and celebrating Miami\'s art culture.',
    categories: [
      {
        id: 'cat-1',
        name: 'Arts & Culture',
        slug: 'art',
        description: 'Visual arts, galleries, and cultural events',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-12', name: 'street-art', display: 'Street Art' },
      { id: 'tag-13', name: 'wynwood', display: 'Wynwood' },
      { id: 'tag-14', name: 'murals', display: 'Murals' }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    title: 'Classical Music Series Returns to Bayfront Park',
    slug: 'classical-music-series-returns-bayfront-park',
    body: `<p>The annual Bayfront Park Classical Music Series returns this month with a lineup of world-class orchestras and soloists. The free outdoor concerts take place every Saturday evening through the spring season, bringing classical music to one of Miami's most beautiful public spaces.</p>

<p>This year's series includes performances by the Miami Symphony Orchestra, guest appearances from international soloists, and special family-friendly matinees. The series has become a beloved tradition, attracting thousands of music lovers who spread out on blankets and lawn chairs under the stars.</p>

<p>The season opens with a performance of Beethoven's Symphony No. 5, conducted by Music Director Eduardo Marturet. The famous opening notes will echo across the park, creating an unforgettable experience for audience members both familiar and new to classical music.</p>

<p>Guest soloists this season include Grammy-winning violinist Joshua Bell, who will perform Tchaikovsky's Violin Concerto, and acclaimed pianist Yuja Wang, presenting Rachmaninoff's Piano Concerto No. 3. These world-renowned artists are making special appearances specifically for this free public series.</p>

<p>What makes the series special is its accessibility. Unlike traditional concert halls where tickets can cost hundreds of dollars, these performances are completely free. Attendees can bring picnics, enjoy the waterfront setting, and experience classical music in a relaxed, informal atmosphere.</p>

<p>The venue itself is part of the magic. Bayfront Park's natural amphitheater, with Biscayne Bay as a backdrop, creates a unique acoustic environment. The sound carries beautifully across the grass, allowing those at the back to still have a full musical experience.</p>

<p>Family matinees on Sunday afternoons make the series accessible to children. These shorter, interactive concerts include explanations of the music, demonstrations of instruments, and opportunities for young audience members to meet the musicians.</p>

<p>The Miami Symphony Orchestra has tailored its programming for the outdoor setting, choosing pieces that work well in the park's acoustic environment. The programs blend beloved classics with contemporary works by Latin American composers, reflecting Miami's cultural diversity.</p>

<p>Local food vendors set up around the park during performances, offering everything from gourmet food trucks to simple snacks. The combination of music, food, and community creates a festival-like atmosphere that makes classical music approachable for all.</p>

<p>The series receives support from the City of Miami, private sponsors, and individual donors who believe in making great music accessible to everyone. This public-private partnership model ensures the series can continue offering free performances year after year.</p>

<p>As spring progresses and the series continues, it serves as a reminder of the power of music to bring communities together. Under the stars, with the bay breeze and world-class performances, it's clear why this series has become one of Miami's most cherished cultural traditions.</p>`,
    heroImage: 'mock-hero-6.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbaf53?w=1200&h=628&fit=crop',
    heroImageAlt: 'Orchestra performing at Bayfront Park',
    authorName: 'Robert Anderson',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    metaTitle: 'Bayfront Park Classical Music Series 2024',
    metaDescription: 'Enjoy free classical music concerts at Bayfront Park featuring the Miami Symphony Orchestra and international soloists.',
    categories: [
      {
        id: 'cat-2',
        name: 'Things to Do',
        slug: 'things-to-do',
        description: 'Live music, concerts, and performances',
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-15', name: 'classical', display: 'Classical' },
      { id: 'tag-16', name: 'orchestra', display: 'Orchestra' },
      { id: 'tag-17', name: 'free-events', display: 'Free Events' }
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    title: 'Dance Company Premieres New Contemporary Work',
    slug: 'dance-company-premieres-new-contemporary-work',
    body: `<p>Miami Contemporary Dance Company premiered their latest work, "Urban Rhythms," to a sold-out audience last weekend. The piece explores the intersection of urban life and traditional dance forms, creating a powerful commentary on city living and cultural identity.</p>

<p>Choreographed by artistic director Maria Santos, the work features 12 dancers and an original score by local composer Carlos Mendez. The 75-minute piece weaves together elements of contemporary dance, salsa, and hip-hop, reflecting Miami's diverse cultural landscape.</p>

<p>The production opens with dancers moving in mechanical, repetitive patterns, representing the daily grind of city life. As the piece progresses, these structured movements dissolve into fluid, expressive sequences that explore moments of connection and escape within urban environments.</p>

<p>Santos drew inspiration from her own experiences growing up in Miami, watching how different communities use dance as a form of expression and connection. "Urban Rhythms" captures this, showing how movement can be a universal language even when the styles differ.</p>

<p>The set design by Alejandro Cruz transforms throughout the performance. Minimalist cityscape backdrops give way to projections of Miami neighborhoods, creating an immersive environment that places the dancers within the urban landscape they're exploring.</p>

<p>Mendez's score blends electronic beats with traditional Latin percussion, creating a soundscape that mirrors the choreography's fusion of styles. Live musicians join recorded tracks for key sections, adding an organic quality that enhances the performance's emotional impact.</p>

<p>The dancers' costumes, designed by local fashion artist Sofia Vega, evolve with the piece. Starting with monochrome, uniform-like clothing, they gradually incorporate colorful, individualized elements that represent personal expression breaking through urban conformity.</p>

<p>One of the piece's most powerful moments comes when the full company performs a section inspired by Miami's street festivals. The stage explodes with energy as dancers move in intricate patterns that echo the community gatherings that fill the city's neighborhoods on weekends.</p>

<p>The premiere received a standing ovation, with audience members particularly moved by the work's emotional depth. Critics praised Santos's ability to blend technical virtuosity with genuine storytelling, creating dance theater that's both accessible and artistically rigorous.</p>

<p>Following the sold-out premiere weekend, "Urban Rhythms" will tour to other Florida cities before potentially heading to New York. The company has also announced that it will become part of their permanent repertoire, ensuring future audiences can experience this powerful work.</p>

<p>For those who missed the premiere, the company will present "Urban Rhythms" again next month as part of their regular season. The work represents a high point for Miami Contemporary Dance Company, showcasing the city's dance talent on both a local and potentially national stage.</p>`,
    heroImage: 'mock-hero-7.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=628&fit=crop',
    heroImageAlt: 'Contemporary dance performance',
    authorName: 'Lisa Park',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    metaTitle: 'Miami Contemporary Dance - Urban Rhythms Premiere',
    metaDescription: 'Experience the premiere of "Urban Rhythms," a new contemporary dance work exploring urban life and traditional dance.',
    categories: [
      {
        id: 'cat-5',
        name: 'Things to Do',
        slug: 'things-to-do',
        description: 'Dance performances and companies',
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-18', name: 'dance', display: 'Dance' },
      { id: 'tag-19', name: 'contemporary', display: 'Contemporary' },
      { id: 'tag-20', name: 'premiere', display: 'Premiere' }
    ],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    title: 'Photography Exhibition Highlights Miami\'s Cultural Diversity',
    slug: 'photography-exhibition-highlights-miami-cultural-diversity',
    body: `<p>The "Miami Mosaic" photography exhibition opened at the Frost Art Museum, showcasing the work of 30 local photographers. The collection celebrates the city's rich cultural diversity through stunning visual narratives that capture Miami's unique character.</p>

<p>The exhibition runs through the end of the month and includes guided tours, artist talks, and special workshops for aspiring photographers. Curated by museum director Jane Doe, "Miami Mosaic" presents a comprehensive look at how photographers interpret the city's complex identity.</p>

<p>The exhibition is organized thematically, with sections dedicated to "Street Life," "Cultural Traditions," "Architectural Narratives," and "Natural Miami." Each section tells a different story about the city, from bustling markets to quiet residential streets, from religious ceremonies to beach scenes.</p>

<p>Notable works include Maria Rodriguez's series "Abuela's Kitchen," intimate portraits of grandmothers preparing traditional meals in their homes. The photographs, shot on film, have a timeless quality that connects present-day Miami to its immigrant roots.</p>

<p>James Wilson's "Construction Dreams" documents the city's ever-changing skyline, capturing the tension between development and preservation. His large-scale prints show construction sites juxtaposed with historic buildings, asking viewers to consider what Miami is becoming.</p>

<p>Perhaps the most powerful section is "Community Portraits," featuring works by photographers who spent months embedded in specific neighborhoods. These images go beyond surface representations to show the people, rituals, and daily life that define Miami's communities.</p>

<p>The exhibition includes both color and black-and-white photography, with artists choosing their medium based on what best serves their subject matter. The variety in styles and approaches creates a rich visual experience that reflects Miami's own diversity.</p>

<p>Interactive elements enhance the visitor experience. QR codes throughout the galleries link to audio recordings of photographers discussing their work and processes. A dedicated space allows visitors to submit their own Miami photographs, some of which will be displayed in a rotating digital gallery.</p>

<p>Educational programming complements the exhibition. Free workshops for teenagers cover everything from smartphone photography to traditional darkroom techniques. Professional development sessions help emerging photographers learn about the business side of photography.</p>

<p>The museum shop features limited-edition prints from several exhibiting photographers, allowing visitors to take home pieces of the exhibition. A percentage of sales supports the museum's educational programs and future photography exhibitions.</p>

<p>"Miami Mosaic" represents one of the most comprehensive photography shows ever mounted about the city. For Miami residents, it offers a chance to see their city through fresh eyes. For visitors, it provides deep insight into what makes Miami unique—not just its beaches and nightlife, but its people, communities, and cultural richness.</p>`,
    heroImage: 'mock-hero-8.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=628&fit=crop',
    heroImageAlt: 'Photography exhibition at Frost Art Museum',
    authorName: 'Amanda Foster',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    metaTitle: 'Miami Mosaic Photography Exhibition - Frost Art Museum',
    metaDescription: 'Explore Miami\'s cultural diversity through photography at the "Miami Mosaic" exhibition featuring 30 local artists.',
    categories: [
      {
        id: 'cat-1',
        name: 'Arts & Culture',
        slug: 'art',
        description: 'Visual arts, galleries, and cultural events',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-21', name: 'photography', display: 'Photography' },
      { id: 'tag-22', name: 'exhibition', display: 'Exhibition' },
      { id: 'tag-23', name: 'diversity', display: 'Diversity' }
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '9',
    title: 'Film Festival Showcases Independent Miami Filmmakers',
    slug: 'film-festival-showcases-independent-miami-filmmakers',
    body: `<p>The Miami Independent Film Festival kicked off with a focus on local talent, screening over 40 films from Miami-based directors. The festival includes feature films, documentaries, and short film competitions that showcase the best of Miami's independent film scene.</p>

<p>Special events include Q&A sessions with filmmakers, networking mixers, and awards ceremonies recognizing outstanding contributions to independent cinema. The festival runs for two weeks, with screenings at multiple venues across the city, making it easy for film lovers to catch multiple shows.</p>

<p>This year's opening night featured "Little Havana Stories," a feature-length drama directed by Miami native Sofia Martinez. The film, shot entirely in Miami's Cuban neighborhoods, tells intersecting stories of three families navigating gentrification and cultural preservation. Martinez, who grew up in Little Havana, spent three years developing the project, conducting interviews with community members.</p>

<p>The documentary competition highlights include "Under the Bridge," a powerful look at Miami's homeless population, and "Dade County Dreams," which follows three undocumented students navigating the college application process. These films tackle tough subjects with empathy and nuance, demonstrating how local filmmakers are using their art to address social issues.</p>

<p>Short film screenings offer a platform for emerging directors to showcase their work. Categories include narrative shorts, documentary shorts, and experimental films. The winner receives a $5,000 grant to produce their next project, along with mentorship from established filmmakers.</p>

<p>Innovative programming includes "Drive-In Miami," outdoor screenings at various locations throughout the city. These events bring back the nostalgia of drive-in theaters while providing a safe, socially distanced viewing experience. Families can park, tune in via FM radio, and enjoy films under the stars.</p>

<p>The festival's industry component includes panel discussions on topics ranging from "How to Get Your Film Distributed" to "Crowdfunding for Independent Films." These sessions are invaluable for emerging filmmakers looking to break into the industry.</p>

<p>Networking events create opportunities for collaboration. Filmmakers can meet with producers, distributors, and potential funders, making connections that could lead to future projects. The festival has a strong track record of facilitating partnerships that result in completed films.</p>

<p>Audience choice awards give festival-goers a voice in recognizing outstanding work. Viewers can vote for their favorites, with winners announced at the closing ceremony. These awards often serve as springboards for films seeking wider distribution.</p>

<p>The festival's commitment to showcasing local talent has made it an important part of Miami's cultural calendar. For independent filmmakers, it provides a platform to share their work with audiences and industry professionals. For audiences, it offers a chance to discover fresh voices and stories that reflect Miami's diverse communities.</p>

<p>As the festival continues through its second week, it serves as a reminder of Miami's vibrant independent film scene—one that deserves more recognition on the national stage. With the support of events like this, Miami's filmmakers are building toward a future where the city is known not just for its beaches and nightlife, but for its contributions to independent cinema.</p>`,
    heroImage: 'mock-hero-9.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=628&fit=crop',
    heroImageAlt: 'Film festival screening in Miami',
    authorName: 'James Wilson',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    metaTitle: 'Miami Independent Film Festival 2024',
    metaDescription: 'Discover independent films from Miami filmmakers at the annual film festival featuring 40+ screenings and special events.',
    categories: [
      {
        id: 'cat-6',
        name: 'Things to Do',
        slug: 'things-to-do',
        description: 'Film screenings, festivals, and cinema',
        order: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-24', name: 'film', display: 'Film' },
      { id: 'tag-7', name: 'festival', display: 'Festival' },
      { id: 'tag-25', name: 'independent', display: 'Independent' }
    ],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '10',
    title: 'Design District Shopping Guide: Best Boutiques and Galleries',
    slug: 'design-district-shopping-guide-best-boutiques-galleries',
    body: `<p>Miami's Design District continues to evolve as a premier shopping destination, combining luxury retail with cutting-edge art galleries. Our comprehensive guide highlights the best boutiques, concept stores, and design showrooms in the area.</p>

<p>From internationally recognized fashion houses to local artisan workshops, the Design District offers something for every style and budget. The neighborhood has transformed over the past decade from a furniture district into one of Miami's most stylish shopping destinations, with flagship stores from brands like Dior, Hermès, and Louis Vuitton.</p>

<p>But the Design District is more than just luxury brands. The area's commitment to art and design is evident everywhere, from the rotating public art installations to the architecture itself. The neighborhood's buildings have been designed by world-renowned architects, creating a cohesive aesthetic that makes shopping here an experience in itself.</p>

<p>For fashion lovers, the Design District offers everything from high-end couture to emerging designers. Local boutique "Miami Threads" showcases designers from Latin America and the Caribbean, providing a platform for voices often overlooked in mainstream fashion. Owner Carla Martinez curates a selection that reflects Miami's cultural diversity while maintaining high standards for quality and design.</p>

<p>The district's art galleries are destinations in their own right. ICA Miami showcases cutting-edge contemporary art, while the de la Cruz Collection offers free admission to an extensive private collection. These spaces make art accessible and integrate it seamlessly into the shopping experience.</p>

<p>Food and shopping go hand in hand in the Design District. The area's restaurants range from casual cafés perfect for a shopping break to Michelin-starred fine dining establishments. Mila, a rooftop restaurant and bar, offers stunning views of the neighborhood along with Asian-inspired cuisine. The aesthetic experience extends to the dining, with many restaurants featuring interiors designed by the same architects who shaped the district.</p>

<p>For those interested in home design, the district's furniture showrooms are treasure troves. These spaces showcase everything from mid-century modern classics to contemporary pieces from international designers. Many showrooms offer design consultation services, making it easy to create a cohesive home aesthetic.</p>

<p>The Design District hosts regular events that bring the community together. Art walks on the second Saturday of each month feature gallery openings, live music, and special promotions. Design Week in December transforms the entire neighborhood into a celebration of creativity, with installations, workshops, and exclusive shopping experiences.</p>

<p>Sustainability is increasingly important in the Design District. Several boutiques specialize in sustainable and ethical fashion, offering alternatives to fast fashion. Local artisans sell handmade goods at the monthly market, providing opportunities to support independent makers.</p>

<p>The neighborhood's transformation represents a successful model of urban development that prioritizes design, culture, and community. As the Design District continues to grow, it maintains its commitment to these values, ensuring that shopping here remains an enriching cultural experience, not just a commercial transaction.</p>

<p>Whether you're looking for a statement piece for your wardrobe, a unique gift, or simply a beautiful place to spend an afternoon, the Design District delivers. It's a destination that proves shopping can be an art form in itself, where every purchase supports creativity, culture, and community.</p>`,
    heroImage: 'mock-hero-10.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=628&fit=crop',
    heroImageAlt: 'Design District shopping area in Miami',
    authorName: 'Jennifer Lee',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    metaTitle: 'Design District Shopping Guide - Best Boutiques',
    metaDescription: 'Discover the best shopping in Miami\'s Design District with our guide to luxury boutiques, galleries, and concept stores.',
    categories: [
      {
        id: 'cat-7',
        name: 'Shopping',
        slug: 'shopping',
        description: 'Shopping, boutiques, and retail',
        order: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-26', name: 'shopping', display: 'Shopping' },
      { id: 'tag-27', name: 'design-district', display: 'Design District' },
      { id: 'tag-28', name: 'boutiques', display: 'Boutiques' }
    ],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '11',
    title: 'Best New Restaurants Opening This Spring in Miami',
    slug: 'best-new-restaurants-opening-spring-miami',
    body: `<p>Spring brings exciting new culinary destinations to Miami, with several highly anticipated restaurant openings. From innovative fusion concepts to traditional cuisine reimagined, these new spots are already generating buzz among food enthusiasts.</p>

<p>Chef-driven concepts and international flavors are taking center stage, offering unique dining experiences across different neighborhoods. This season's openings represent some of the most creative and ambitious restaurant projects Miami has seen in years.</p>

<p>Leading the pack is "Ocean & Earth," a seafood-focused restaurant from Chef Michelle Rodriguez that opened in Coconut Grove last month. Rodriguez, who trained under several Michelin-starred chefs in Europe, has created a menu that showcases Florida's incredible seafood while incorporating techniques from around the world. The restaurant's sustainable seafood program partners directly with local fishermen, ensuring the freshest possible ingredients while supporting the local fishing community.</p>

<p>In Brickell, "Lima Fusion" brings Peruvian cuisine to Miami with a contemporary twist. Chef Carlos Mendoza grew up in Lima before moving to Miami, and his menu reflects his dual heritage. Dishes like "Ceviche Nikkei," which combines Peruvian ceviche techniques with Japanese flavors, demonstrate Mendoza's innovative approach. The restaurant's design, featuring textiles and art from Peru, creates an immersive cultural experience.</p>

<p>Wynwood gets a new Italian restaurant with "Bottega Wynwood," from restaurateur Maria Bianchi. Unlike Miami's many red-sauce Italian joints, Bottega Wynwood focuses on regional Italian cuisine rarely seen in South Florida. The pasta is made fresh daily, the wine list features lesser-known Italian varietals, and the atmosphere is more trattoria than fine dining—though the quality is anything but casual.</p>

<p>Perhaps the most anticipated opening is "Havana 2024," a Cuban restaurant that reimagines classic dishes for modern palates. Chef Jose Martinez spent months researching traditional Cuban recipes, then worked with his grandmother—still cooking in her Little Havana kitchen—to adapt them. The result is a menu that honors tradition while embracing innovation. The restaurant's rooftop bar, with views of downtown, has already become a destination in itself.</p>

<p>Vegetarian and vegan options get serious treatment at "Plant District," which opened in the Design District. Chef Sarah Kim has created a menu that proves plant-based dining can be both sophisticated and satisfying. Her "Chicken" and Waffles—made with house-made seitan—has diners questioning whether they're eating meat or not. The restaurant's zero-waste kitchen philosophy extends to its operations, with compostable packaging and a program that donates excess food to local shelters.</p>

<p>What sets this season's openings apart is their commitment to sustainability and local sourcing. Several restaurants have gardens where they grow herbs and vegetables. Others work directly with local farmers to source ingredients. This farm-to-table approach isn't just a marketing gimmick—it results in better food and supports the local economy.</p>

<p>Many of these new restaurants also prioritize their beverage programs. Creative cocktails incorporate local ingredients and pay homage to Miami's diverse cultures. Wine lists feature natural and biodynamic wines, reflecting growing interest in sustainable winemaking. Craft beer selections showcase Florida breweries alongside international favorites.</p>

<p>The dining scene's growth reflects Miami's maturation as a food city. We're no longer just about Cuban sandwiches and stone crabs—though those remain beloved. The city's culinary diversity, combined with innovative chefs and engaged diners, is creating a food scene that can compete with any major city.</p>

<p>For food lovers, spring in Miami means exploring these new destinations, discovering new flavors, and supporting the chefs and restaurateurs who are making Miami a true culinary destination. Whether you're looking for a special occasion meal or a casual neighborhood spot, this season's openings offer something for every palate and budget.</p>`,
    heroImage: 'mock-hero-11.jpg',
    heroImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=628&fit=crop',
    heroImageAlt: 'Modern restaurant interior in Miami',
    authorName: 'Carlos Mendez',
    articleType: NewsType.EDITORIAL,
    status: NewsStatus.APPROVED,
    publishedMarkets: ['miami'],
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
    metaTitle: 'Best New Restaurants Miami Spring 2024',
    metaDescription: 'Discover the best new restaurants opening in Miami this spring, featuring chef-driven concepts and international flavors.',
    categories: [
      {
        id: 'cat-city-guides',
        name: 'City Guides',
        slug: 'city-guides',
        description: 'City guides, recommendations, and local insights',
        order: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    tags: [
      { id: 'tag-29', name: 'restaurants', display: 'Restaurants' },
      { id: 'tag-30', name: 'new-openings', display: 'New Openings' },
      { id: 'tag-31', name: 'spring', display: 'Spring' }
    ],
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  }
];
