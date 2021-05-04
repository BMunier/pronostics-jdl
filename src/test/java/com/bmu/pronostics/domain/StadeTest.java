package com.bmu.pronostics.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bmu.pronostics.web.rest.TestUtil;

public class StadeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stade.class);
        Stade stade1 = new Stade();
        stade1.setId(1L);
        Stade stade2 = new Stade();
        stade2.setId(stade1.getId());
        assertThat(stade1).isEqualTo(stade2);
        stade2.setId(2L);
        assertThat(stade1).isNotEqualTo(stade2);
        stade1.setId(null);
        assertThat(stade1).isNotEqualTo(stade2);
    }
}
