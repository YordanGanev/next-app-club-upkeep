import Image from "next/image";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

import HeadBar from "@components/layout/headerBar";

import "./about-page.css";

export default async function About() {
  const session = await getSession();

  return (
    <>
      <HeadBar user={session?.user} />
      <div className={`about`}>
        <section className="header">
          <div className="container">
            {!session && (
              <>
                <h1>
                  <span className="text-light">Club management</span> don&apos;t
                  have to be a struggle
                </h1>
                <div>
                  <p>
                    Create account or login to get started. Lorem ipsum dolor
                    sit amet consectetur adipisicing elit. Quisquam, voluptatum.
                  </p>
                  <a href={"/api/auth/signup"} className="link-button">
                    I want to explore
                  </a>
                </div>
              </>
            )}
            {session && (
              <>
                <h1>
                  <span className="text-light">Club management</span> don&apos;t
                  have to be a struggle
                </h1>
                <div>
                  <p>Welcome {session.user.name}!</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatum.
                  </p>

                  <Link href={"/dashboard"} legacyBehavior>
                    <a className="link-button">Back to dashboard</a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="more">
          <div className="container more-container">
            <div className="more__card">
              <h2>Mobile</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad,
                accusamus. Aspernatur expedita omnis dolores, quasi officiis
                harum! Officia placeat numquam iste libero possimus accusantium
                eos.
              </p>
            </div>
            <div>
              <h2>Efficient</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                omnis animi, necessitatibus illum placeat officiis in ad,
                eligendi aperiam consequuntur doloribus dolorum reprehenderit,
                repellat iste?
              </p>
            </div>
            <div>
              <h2>Simple</h2>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non
                laborum libero, ut ratione iste, tempora minima quasi alias eius
                enim saepe, consectetur molestias voluptatem inventore.
              </p>
            </div>
          </div>
        </section>

        <main className="main">
          <div className="container">
            <div className="content">
              <h2>It doesn&apos;t have to be so hard</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                nobis similique iste a officiis? Repellendus distinctio
                praesentium culpa explicabo ab, magni nam libero iste possimus
                quaerat hic architecto velit, quisquam ullam quia nisi pariatur?
                Exercitationem tempore id alias fugit. Vel nesciunt incidunt
                voluptatibus error voluptatem ratione asperiores, accusantium
                rem laudantium!
              </p>
              <Image
                width={500}
                height={500}
                src="/about-img.jpg"
                alt="scratch book drawing of web page desing"
              />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit
                in ab quasi labore minus eveniet, provident exercitationem
                aperiam. Excepturi reiciendis pariatur ducimus dignissimos nihil
                minima doloribus fuga amet, placeat praesentium dolores magni
                explicabo, blanditiis maiores impedit quam! Omnis dolorum ipsum
                aperiam quos architecto eius iste!
              </p>
            </div>
            <aside className="text-light">
              <div className="dark">
                <h2 className="text-light">Empower the club&apos;s growth</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  deleniti inventore totam odit maiores error laboriosam vero
                  mollitia ipsum ullam.
                </p>
              </div>
              <div className="dark">
                <h2 className="text-light">Unlock the potential</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolores, aut harum dolor deleniti possimus sequi magnam ullam
                  aperiam praesentium sapiente!
                </p>
              </div>
              <div className="dark">
                <h2 className="text-light">Build a memorable journey</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Delectus, vero tempora fugiat nisi porro temporibus at error
                  earum sapiente dignissimos.
                </p>
              </div>
            </aside>
          </div>
        </main>

        <section className="footer">
          <div className="container">
            <div className="footer-flex">
              <div>
                <h3>About our company</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Animi, maxime aperiam ratione ad in deleniti itaque dolorum
                  perferendis tempore quos?
                </p>
              </div>
              <div>
                <h3>Getting around</h3>
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
